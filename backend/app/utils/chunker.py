import ast
import os
import re
from typing import List, Tuple, Optional

# ---------- Public API ----------

def chunk_code(
    content: str,
    max_tokens: int = 512,
    language: Optional[str] = None,
    filename: Optional[str] = None,
) -> List[str]:
    """
    Semantically chunk source code across many languages.
    Falls back to line/block splitting if structure isn't detectable.

    Args:
        content: source text
        max_tokens: approx token budget per chunk
        language: optional language hint (e.g. 'python', 'js', 'ts', 'java', 'c', 'cpp', 'csharp',
                  'go', 'rust', 'kotlin', 'swift', 'scala', 'php', 'ruby', 'bash', 'sh',
                  'sql', 'html', 'css', 'json', 'yaml', 'md')
        filename: optional file name to infer language from extension

    Returns:
        List of chunk strings (non-empty, trimmed)
    """
    if not content or not content.strip():
        return []

    approx_len = max(64, int(max_tokens) * 4)  # ~chars per chunk

    lang = (language or "").strip().lower() or _detect_language_from_filename_or_shebang(
        filename, content
    )

    # Dispatch by language family
    try:
        if lang == "python" or (lang == "py"):
            return _chunk_python_ast(content, approx_len)

        if lang in {"js", "javascript", "ts", "typescript", "java", "c", "cpp", "c++",
                    "csharp", "cs", "go", "rust", "kotlin", "swift", "scala", "php"}:
            return _chunk_brace_langs(content, approx_len, lang)

        if lang in {"ruby", "rb"}:
            return _chunk_ruby(content, approx_len)

        if lang in {"bash", "sh", "shell"}:
            return _chunk_shell(content, approx_len)

        if lang == "sql":
            return _chunk_sql(content, approx_len)

        if lang in {"html", "htm"}:
            return _chunk_html(content, approx_len)

        if lang == "css":
            return _chunk_css(content, approx_len)

        if lang in {"json", "yaml", "yml", "md", "markdown"}:
            return _split_fallback(content.splitlines(), approx_len)

        # Unknown → try generic brace parsing; else fallback
        generic = _chunk_brace_langs(content, approx_len, lang=None)
        if generic:
            return generic
        return _split_fallback(content.splitlines(), approx_len)

    except Exception:
        # Guardrail: never fail hard — just give reasonable chunks
        return _split_fallback(content.splitlines(), approx_len)

# ---------- Language detection ----------

_EXT_TO_LANG = {
    ".py": "python",
    ".js": "js",
    ".mjs": "js",
    ".cjs": "js",
    ".ts": "ts",
    ".tsx": "ts",
    ".jsx": "js",
    ".java": "java",
    ".c": "c",
    ".h": "c",
    ".cc": "cpp",
    ".cpp": "cpp",
    ".hpp": "cpp",
    ".cs": "csharp",
    ".go": "go",
    ".rs": "rust",
    ".kt": "kotlin",
    ".kts": "kotlin",
    ".swift": "swift",
    ".scala": "scala",
    ".php": "php",
    ".rb": "ruby",
    ".sh": "bash",
    ".bash": "bash",
    ".zsh": "bash",
    ".sql": "sql",
    ".html": "html",
    ".htm": "html",
    ".css": "css",
    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".md": "md",
    ".markdown": "md",
}

def _detect_language_from_filename_or_shebang(filename: Optional[str], content: str) -> str:
    if filename:
        _, ext = os.path.splitext(filename.lower())
        if ext in _EXT_TO_LANG:
            return _EXT_TO_LANG[ext]

    # crude shebang sniffing
    first_line = content.splitlines()[0].strip() if content else ""
    if first_line.startswith("#!"):
        if "python" in first_line:
            return "python"
        if "node" in first_line or "deno" in first_line:
            return "js"
        if "bash" in first_line or "sh" in first_line or "zsh" in first_line:
            return "bash"

    # fallback guess
    return ""

# ---------- Python (AST) ----------

def _chunk_python_ast(content: str, approx_len: int) -> List[str]:
    lines = content.splitlines()
    try:
        tree = ast.parse(content)
    except SyntaxError:
        return _split_fallback(lines, approx_len)

    spans: List[Tuple[int, int]] = []
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef,
                             ast.Import, ast.ImportFrom)):
            start = getattr(node, "lineno", None)
            end = getattr(node, "end_lineno", None)
            if start and end:
                spans.append((start, end))

    if not spans:
        return _split_fallback(lines, approx_len)

    blocks = ["\n".join(lines[s - 1:e]) for s, e in spans]
    return _merge_blocks(blocks, approx_len)

# ---------- Brace languages ----------

# key declaration regexes per family
_DECL_PATTERNS = {
    "js": re.compile(r"""
        ^\s*(export\s+)?(async\s+)?function\s+\w+\s*\(|     # function
        ^\s*(export\s+)?class\s+\w+|                       # class
        ^\s*(export\s+)?(interface|type)\s+\w+|            # TS types
        ^\s*(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s+)?\([^)]*\)\s*=> # arrow fn
    """, re.MULTILINE | re.VERBOSE),
    "ts": None,  # use JS pattern (TS superset)
    "java": re.compile(r"""
        ^\s*(public|protected|private|abstract|final|static|\s)*\s*
        (class|interface|enum)\s+\w+|
        ^\s*(public|protected|private|static|\s)*\s*[\w<>\[\],\s\*]+?\s+\w+\s*\([^;{]*\)\s*\{
    """, re.MULTILINE | re.VERBOSE),
    "c": re.compile(r"""
        ^\s*(typedef\s+struct|struct|enum|union)\b|
        ^\s*[\w\*\s]+\s+\**\w+\s*\([^;]*\)\s*\{          # function impl
    """, re.MULTILINE | re.VERBOSE),
    "cpp": re.compile(r"""
        ^\s*(template\s*<[^>]+>\s*)?(class|struct|enum)\b|
        ^\s*[\w:<>\*\s&]+\s+\**\w+::?\w*\s*\([^;]*\)\s*\{  # method/func impl
    """, re.MULTILINE | re.VERBOSE),
    "csharp": re.compile(r"""
        ^\s*(namespace)\s+\w+(\.\w+)*|
        ^\s*(public|private|protected|internal|static|abstract|sealed|partial|\s)*\s*
        (class|struct|interface|enum)\s+\w+|
        ^\s*(public|private|protected|internal|static|\s)*[\w<>\[\],\s]+\s+\w+\s*\([^;{]*\)\s*\{
    """, re.MULTILINE | re.VERBOSE),
    "go": re.compile(r"""
        ^\s*package\s+\w+|
        ^\s*import(\s*\(|\s+".*")|
        ^\s*type\s+\w+|
        ^\s*func\s+(\([^)]+\)\s*)?\w+\s*\(
    """, re.MULTILINE | re.VERBOSE),
    "rust": re.compile(r"""
        ^\s*(pub\s+)?(mod|fn|struct|enum|trait|impl)\b
    """, re.MULTILINE | re.VERBOSE),
    "kotlin": re.compile(r"""
        ^\s*(package|import)\b|
        ^\s*(class|object|interface|enum|data\s+class|sealed\s+class)\b|
        ^\s*(suspend\s+)?fun\s+\w+\s*\(
    """, re.MULTILINE | re.VERBOSE),
    "swift": re.compile(r"""
        ^\s*(import)\s+\w+|
        ^\s*(class|struct|enum|protocol|extension)\s+\w+|
        ^\s*func\s+\w+\s*\(
    """, re.MULTILINE | re.VERBOSE),
    "scala": re.compile(r"""
        ^\s*(package|import)\b|
        ^\s*(class|object|trait)\s+\w+|
        ^\s*def\s+\w+\s*\(
    """, re.MULTILINE | re.VERBOSE),
    "php": re.compile(r"""
        ^\s*<\?php\b|
        ^\s*namespace\s+[\w\\]+;|
        ^\s*use\s+[\w\\]+;|
        ^\s*(class|interface|trait)\s+\w+|
        ^\s*function\s+\w+\s*\(
    """, re.MULTILINE | re.VERBOSE),
}

def _chunk_brace_langs(content: str, approx_len: int, lang: Optional[str]) -> List[str]:
    """
    Split by top-level declarations; maintain brace depth to avoid splitting inside bodies.
    Works for JS/TS, Java, C/C++, C#, Go, Rust, Kotlin, Swift, Scala, PHP, and as a generic brace strategy.
    """
    lines = content.splitlines()
    text = content

    # Choose declaration pattern
    pat = None
    if lang in ("ts",):
        pat = _DECL_PATTERNS["js"]
    elif lang in _DECL_PATTERNS:
        pat = _DECL_PATTERNS[lang]
    else:
        # generic top-level guess
        pat = re.compile(r"""
            ^\s*(export\s+)?(class|interface|struct|enum|trait|protocol|impl|mod|fn|func|def|type)\b|
            ^\s*(public|private|protected|internal|static|abstract|final|sealed|partial|\s)*\s*
            (class|struct|interface|enum)\b
        """, re.MULTILINE | re.VERBOSE)

    # Find candidate starts
    starts = [m.start() for m in pat.finditer(text)] or [0]
    # Ensure we include beginning if first decl not at 0
    if starts[0] != 0:
        starts = [0] + starts
    starts = sorted(set(starts))

    # Derive blocks by scanning brace depth
    blocks: List[str] = []
    for i, s in enumerate(starts):
        e = starts[i + 1] if i + 1 < len(starts) else len(text)
        # Expand 'e' forward until brace depth returns to 0 (best-effort)
        snippet = text[s:e]
        end_index = _expand_to_top_level_end(text, start=e)
        e = max(e, end_index)
        blocks.append(text[s:e])

    # If we somehow got a single block spanning all (weak signals), try a lighter strategy
    if len(blocks) == 1 and len(content) > approx_len:
        return _split_fallback(lines, approx_len)

    return _merge_blocks(blocks, approx_len)

def _expand_to_top_level_end(text: str, start: int) -> int:
    """
    Walk forward to a point where brace depth is 0 (top-level), so we don't cut mid-block.
    Stops early if too long.
    """
    depth = 0
    i = start
    n = len(text)
    # simple string / comment skipping
    in_squote = in_dquote = in_bquote = False
    while i < n:
        ch = text[i]
        # handle strings (very naive but helpful)
        if ch == "'" and not in_dquote and not in_bquote:
            in_squote = not in_squote
        elif ch == '"' and not in_squote and not in_bquote:
            in_dquote = not in_dquote
        elif ch == '`' and not in_squote and not in_dquote:
            in_bquote = not in_bquote

        if not (in_squote or in_dquote or in_bquote):
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth = max(0, depth - 1)
                if depth == 0:
                    # include this closing brace
                    i += 1
                    break
        i += 1
        # don't run forever; give up after some window
        if i - start > 20000:
            break
    return i

# ---------- Ruby ----------

def _chunk_ruby(content: str, approx_len: int) -> List[str]:
    # Split on def/class/module at column start; balance with 'end'
    lines = content.splitlines()
    blocks: List[str] = []
    buf: List[str] = []
    depth = 0
    start_keywords = re.compile(r"^\s*(def|class|module)\b")
    for line in lines:
        if start_keywords.match(line) and depth == 0 and buf:
            blocks.append("\n".join(buf))
            buf = []
        buf.append(line)
        if re.search(r"\b(do|def|class|module)\b", line):
            depth += 1
        if re.search(r"\bend\b", line):
            depth = max(0, depth - 1)
    if buf:
        blocks.append("\n".join(buf))
    return _merge_blocks(blocks, approx_len)

# ---------- Shell ----------

def _chunk_shell(content: str, approx_len: int) -> List[str]:
    # Split by function boundaries and section comments
    func_start = re.compile(r"^\s*\w+\s*\(\s*\)\s*\{")
    section = re.compile(r"^\s*#\s*-{3,}")
    lines = content.splitlines()
    blocks: List[str] = []
    buf: List[str] = []
    depth = 0
    for line in lines:
        if (func_start.match(line) or section.match(line)) and depth == 0 and buf:
            blocks.append("\n".join(buf))
            buf = []
        buf.append(line)
        if "{" in line:
            depth += line.count("{")
        if "}" in line:
            depth = max(0, depth - line.count("}"))
    if buf:
        blocks.append("\n".join(buf))
    return _merge_blocks(blocks, approx_len)

# ---------- SQL ----------

def _chunk_sql(content: str, approx_len: int) -> List[str]:
    # Split by semicolons at top level (very naive string handling)
    stmts: List[str] = []
    buf = []
    in_squote = in_dquote = False
    for ch in content:
        if ch == "'" and not in_dquote:
            in_squote = not in_squote
        elif ch == '"' and not in_squote:
            in_dquote = not in_dquote
        if ch == ";" and not (in_squote or in_dquote):
            stmts.append("".join(buf).strip())
            buf = []
        else:
            buf.append(ch)
    if buf:
        tail = "".join(buf).strip()
        if tail:
            stmts.append(tail)
    return _merge_blocks(stmts, approx_len)

# ---------- HTML ----------

def _chunk_html(content: str, approx_len: int) -> List[str]:
    # Chunk by major sections (section/article/main/nav/footer) else by h2/h3, else by div
    sections = re.split(r"(?i)(?=<\s*(section|article|main|nav|footer)\b)", content)
    blocks = [s for s in sections if s.strip()] or re.split(r"(?i)(?=<\s*h[23]\b)", content)
    blocks = [b for b in blocks if b.strip()]
    if not blocks:
        blocks = re.split(r"(?i)(?=<\s*div\b)", content)
        blocks = [b for b in blocks if b.strip()]
    if not blocks:
        return _split_fallback(content.splitlines(), approx_len)
    return _merge_blocks(blocks, approx_len)

# ---------- CSS ----------

def _chunk_css(content: str, approx_len: int) -> List[str]:
    # Split by top-level rule blocks using brace depth
    blocks: List[str] = []
    buf = []
    depth = 0
    for ch in content:
        buf.append(ch)
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth = max(0, depth - 1)
            if depth == 0:
                blocks.append("".join(buf).strip())
                buf = []
    if buf and "".join(buf).strip():
        blocks.append("".join(buf).strip())
    if not blocks:
        return _split_fallback(content.splitlines(), approx_len)
    return _merge_blocks(blocks, approx_len)

# ---------- Merging / Fallback ----------

def _merge_blocks(blocks: List[str], approx_len: int) -> List[str]:
    """Pack semantically split blocks into size-limited chunks."""
    chunks: List[str] = []
    cur: List[str] = []
    cur_len = 0

    for b in (blk for blk in blocks if blk and blk.strip()):
        blen = len(b)
        if blen > approx_len:
            # split large block further by lines
            sub = _split_fallback(b.splitlines(), approx_len)
            for s in sub:
                if s.strip():
                    if len(s) > approx_len and "\n" in s:
                        # final guard: hard slice if a single line is enormous
                        chunks.extend(_hard_slice(s, approx_len))
                    else:
                        chunks.append(s.strip())
            continue

        if cur_len + blen > approx_len and cur:
            chunks.append("\n".join(cur).strip())
            cur, cur_len = [], 0

        cur.append(b.rstrip())
        cur_len += blen + 1  # join newline

    if cur:
        chunks.append("\n".join(cur).strip())

    # final cleanup
    return [c for c in chunks if c and c.strip()]

def _split_fallback(lines: List[str], approx_len: int) -> List[str]:
    chunks: List[str] = []
    buf: List[str] = []
    clen = 0
    for line in lines:
        # keep blank lines to preserve spacing sparsely
        l = line if line.endswith("\n") else line + "\n"
        if clen + len(l) > approx_len and buf:
            chunks.append("".join(buf).rstrip())
            buf, clen = [], 0
        buf.append(l)
        clen += len(l)
    if buf:
        chunks.append("".join(buf).rstrip())
    return chunks

def _hard_slice(s: str, approx_len: int) -> List[str]:
    return [s[i:i+approx_len] for i in range(0, len(s), approx_len)]
