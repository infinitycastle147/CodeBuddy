import Mermaid from '@theme/Mermaid';
import styles from './ShowDontTell.module.css';

const codeExample = {
  title: 'Authentication Flow',
  description: 'Complex user authentication with multiple paths',
  code: `async function authenticateUser(credentials) {
  const { username, password, mfaToken } = credentials;
  
  try {
    const user = await validateCredentials(username, password);
    
    if (user.mfaEnabled) {
      if (!mfaToken) {
        return { status: 'mfa_required', challenge: generateMFAChallenge() };
      }
      
      const mfaValid = await validateMFA(user.id, mfaToken);
      if (!mfaValid) {
        throw new Error('Invalid MFA token');
      }
    }
    
    const session = await createSession(user.id);
    return { status: 'success', user, session };
    
  } catch (error) {
    await logFailedAttempt(username);
    return { status: 'error', message: error.message };
  }
}`,
  diagram: `
graph TD
    A[Start Authentication] --> B[Validate Credentials]
    B --> C{Valid?}
    C -->|No| H[Log Failed Attempt]
    H --> I[Return Error]
    C -->|Yes| D{MFA Enabled?}
    D -->|No| G[Create Session]
    D -->|Yes| E{MFA Token Provided?}
    E -->|No| F[Return MFA Challenge]
    E -->|Yes| J[Validate MFA]
    J --> K{MFA Valid?}
    K -->|No| H
    K -->|Yes| G
    G --> L[Return Success]
    
    style A fill:#e1f5fe
    style L fill:#e8f5e8
    style I fill:#ffebee
    style F fill:#fff3e0
`
};

import { useState } from 'react';

export default function ShowDontTell() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: '📝', title: 'Write Code', description: 'Write your complex logic' },
    { icon: '🤖', title: 'AI Analysis', description: 'CodeBuddy analyzes patterns' },
    { icon: '📊', title: 'Visual Diagram', description: 'Get instant visual flow' }
  ];

  return (
    <section className={styles.showDontTell}>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.mainTitle}>
              Show, <span className={styles.accentText}>Don't Tell</span>
            </h2>
            <p className={styles.subtitle}>
              Transform complex code into crystal-clear visual diagrams. 
              See your logic flow, understand dependencies, and spot patterns instantly.
            </p>
          </div>
          
          {/* Animated Process Steps */}
          <div className={styles.processSteps}>
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`${styles.step} ${index === activeStep ? styles.stepActive : ''} ${index < activeStep ? styles.stepCompleted : ''}`}
                onClick={() => setActiveStep(index)}
              >
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepContent}>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={styles.stepConnector}>
                    <div className={styles.stepArrow}>→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Examples */}
        <div className={styles.examples}>
          <div className={styles.exampleTabs}>
            <div className={styles.tab}>
              <span className={styles.tabTitle}>{codeExample.title}</span>
              <span className={styles.tabDescription}>{codeExample.description}</span>
            </div>
          </div>

          <div className={styles.exampleContent}>
            <div className={styles.codeAndDiagram}>
              {/* Code Section */}
              <div className={`${styles.codeSection} ${activeStep >= 0 ? styles.contentAnimating : ''}`}>
                <div className={styles.codeHeader}>
                  <div className={styles.windowControls}>
                    <span className={styles.control}></span>
                    <span className={styles.control}></span>
                    <span className={styles.control}></span>
                  </div>
                  <span className={styles.fileName}>example.js</span>
                </div>
                <pre className={styles.codeBlock}>
                  <code>{codeExample.code}</code>
                </pre>
              </div>

              {/* Transformation Arrow */}
              <div className={`${styles.transformArrow} ${activeStep >= 1 ? styles.contentAnimating : ''}`}>
                <div className={styles.arrowIcon}>⚡</div>
                <span className={styles.arrowLabel}>AI Analysis</span>
              </div>

              {/* Diagram Section */}
              <div className={`${styles.diagramSection} ${activeStep >= 2 ? styles.contentAnimating : ''}`}>
                <div className={styles.diagramHeader}>
                  <h4>Generated Flow Diagram</h4>
                  <div className={styles.diagramControls}>
                    <button className={styles.controlBtn}>🔍</button>
                    <button className={styles.controlBtn}>💾</button>
                    <button className={styles.controlBtn}>🔗</button>
                  </div>
                </div>
                <div className={styles.diagramContainer}>
                  <Mermaid value={codeExample.diagram} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className={styles.benefits}>
          <h3 className={styles.benefitsTitle}>Why Visual Code Analysis Matters</h3>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🚀</div>
              <h4>Faster Onboarding</h4>
              <p>New team members understand complex codebases 10x faster with visual diagrams</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🔍</div>
              <h4>Spot Issues Early</h4>
              <p>Identify code smells, circular dependencies, and architectural problems at a glance</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>📚</div>
              <h4>Living Documentation</h4>
              <p>Auto-generated diagrams stay in sync with your code, no manual updates needed</p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎯</div>
              <h4>Better Planning</h4>
              <p>Visualize before you code. Plan refactoring and new features more effectively</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.cta}>
          <h3>Ready to See Your Code in a New Light?</h3>
          <p>Try CodeBuddy free for 14 days. No credit card required.</p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn}>
              Start Free Trial
              <span className={styles.btnIcon}>→</span>
            </button>
            <button className={styles.secondaryBtn}>
              Watch Demo
              <span className={styles.btnIcon}>▶</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}