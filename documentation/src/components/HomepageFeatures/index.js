import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Conversational Code Analysis',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Engage in natural language conversations with your codebase. Ask questions, get explanations, and understand your code like never before.
      </>
    ),
    highlight: 'Chat with Code',
    color: 'blue'
  },
  {
    title: 'Automated Diagramming',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Automatically generate Mermaid diagrams from your code to visualize architecture, workflows, and relationships with ease.
      </>
    ),
    highlight: 'Visual Insights',
    color: 'green'
  },
  {
    title: 'Deep Repository Insight',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Connect to your GitHub repositories to gain a deep, holistic understanding of your entire codebase, from top to bottom.
      </>
    ),
    highlight: 'Full Analysis',
    color: 'purple'
  },
];

function Feature({Svg, title, description, highlight, color}) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <div className={clsx(styles.featureCard, styles[`feature--${color}`])}>
        <div className={styles.featureIcon}>
          <Svg className={styles.featureSvg} role="img" />
          <div className={clsx(styles.featureBadge, styles[`badge--${color}`])}>
            {highlight}
          </div>
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description}</p>
          <div className={styles.featureAction}>
            <span className={styles.learnMore}>Learn more →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <Heading as="h2" className={styles.featuresTitle}>
            Powerful Features for Modern Development
          </Heading>
          <p className={styles.featuresSubtitle}>
            Transform how you understand and work with your codebase
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}