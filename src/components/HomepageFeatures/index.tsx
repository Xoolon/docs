import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Benchmark Intelligence',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Access real‑time percentiles, distribution histograms, and historical trends
        across 7+ commerce categories. Know exactly where you stand.
      </>
    ),
  },
  {
    title: 'VCFS Data Schema',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Submit your financials using the Valcr Commerce Financial Schema (VCFS).
        Get a completeness score and unlock AI‑powered insights.
      </>
    ),
  },
  {
    title: 'Enterprise Ready',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        XBRL exports, webhooks, role‑based scopes, and a robust API.
        Built for financial analysts, engineers, and data teams.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}