import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import ShowDontTell from '@site/src/components/ShowDontTell';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      {/* Animated background elements */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.codeLines}></div>
        <div className={styles.floatingNodes}></div>
      </div>
      
      <div className="container">
        <div className={styles.heroContent}>
          {/* Main heading with gradient text */}
          <Heading as="h1" className={clsx("hero__title", styles.gradientTitle)}>
            Understand Your Codebase,
            <span className={styles.accentText}> Instantly</span>
          </Heading>
          
          {/* Enhanced subtitle with better typography */}
          <p className={clsx("hero__subtitle", styles.enhancedSubtitle)}>
            CodeBuddy is your AI-powered companion for deep code analysis, 
            automated diagramming, and conversational exploration of any codebase.
          </p>
          
          {/* Feature highlights */}
          <div className={styles.featureHighlights}>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>🤖</span>
              <span>AI-Powered Analysis</span>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>📊</span>
              <span>Auto Diagrams</span>
            </div>
            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>💬</span>
              <span>Chat with Code</span>
            </div>
          </div>
          
          {/* CTA buttons with improved styling */}
          <div className={styles.ctaButtons}>
            <Link
              className={clsx("button button--lg", styles.primaryButton)}
              to="/docs/intro">
              <span className={styles.buttonIcon}>🚀</span>
              Get Started
              <span className={styles.buttonBadge}>5min</span>
            </Link>
            <Link
              className={clsx("button button--outline button--lg", styles.secondaryButton)}
              to="/docs/api/overview">
              <span className={styles.buttonIcon}>⚡</span>
              Explore API
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>10k+</span>
              <span className={styles.trustLabel}>Developers</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>100+</span>
              <span className={styles.trustLabel}>Languages</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustNumber}>⭐ 4.9</span>
              <span className={styles.trustLabel}>Rating</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title={`${siteConfig.title} - AI Code Analysis`}
      description="Understand your codebase instantly with AI-powered analysis, automated diagramming, and conversational code exploration.">
      <HomepageHeader />
      <main className={styles.main}>
        <HomepageFeatures />
        <ShowDontTell />
      </main>
    </Layout>
  );
}