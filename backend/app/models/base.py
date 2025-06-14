from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field, ConfigDict

# ──────────────────────────────────────────────────────────
# Optional: Mongo‑style ObjectId support
# (↓ remove this block if you don’t talk to Mongo / BSON)
try:
    from bson import ObjectId
except ImportError:         # pragma: no cover
    ObjectId = str  # type: ignore


class PyObjectId(str):
    """A minimal ObjectId wrapper (compatible with Pydantic v2)."""

    @classmethod
    def __get_validators__(cls):  # still works in v2
        yield cls.validate

    @classmethod
    def validate(cls, v: Any) -> str:  # noqa: ANN401
        if isinstance(v, ObjectId):
            return str(v)
        v = str(v)
        if len(v) == 24 and all(c in "0123456789abcdefABCDEF" for c in v):
            return v
        raise ValueError("Invalid ObjectId")
# ──────────────────────────────────────────────────────────


class BaseModelWithId(BaseModel):
    """
    Pydantic‑v2 base model:
    • Works with both SQL (ORM) & NoSQL (ODM) sources
    • Uses Mongo‑friendly `_id` alias
    • Forbids unknown keys
    • Serialises datetimes as ISO‑8601
    """

    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")
    updated_at: datetime = Field(default_factory=datetime.utcnow, alias="updatedAt")

    # ----- Pydantic‑v2 configuration -----
    model_config = ConfigDict(
        populate_by_name=True,          # accept field names OR aliases
        from_attributes=True,           # replaces `orm_mode=True`
        extra="forbid",                 # reject unexpected keys
        json_encoders={datetime: lambda v: v.isoformat()},
    )

    # ---------- Helper constructors ----------
    @classmethod
    def from_orm(cls, obj: Any) -> "BaseModelWithId":      # type: ignore[name-defined]
        """Build from a typical SQLAlchemy / ORM entity."""
        return cls.model_validate(obj, from_attributes=True)

    @classmethod
    def from_odm(cls, obj: Any) -> "BaseModelWithId":      # type: ignore[name-defined]
        """
        Build from a dict‑like or attribute‑style NoSQL/ODM document.
        Only model fields / aliases are copied to avoid noise.
        """
        field_names = set(cls.model_fields)                       # real names
        field_aliases = {f.alias for f in cls.model_fields.values() if f.alias}
        allowed = field_names | field_aliases

        if isinstance(obj, dict):
            data: Dict[str, Any] = {k: v for k, v in obj.items() if k in allowed}
        else:
            data = {
                k: getattr(obj, k)
                for k in dir(obj)
                if (k in allowed) and not k.startswith("_")
                and not callable(getattr(obj, k, None))
            }
            data.update(
                {k: v for k, v in getattr(obj, "__dict__", {}).items() if k in allowed}
            )

        return cls(**data)

    # ---------- Serialization helper ----------
    def dict(self, **kwargs):  # type: ignore[override]
        """
        Keep the familiar v1‑style `.dict(by_alias=True)` default.
        Override as needed: `model_dump()` is the canonical v2 method.
        """
        kwargs.setdefault("by_alias", True)
        return super().model_dump(**kwargs)
