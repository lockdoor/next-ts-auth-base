import React from "react";
import styles from './jumbotron.module.css'

interface Props {
  title?: string;
  subTitle?: string;
}

export default function Jumbotron({
  title = "NextJS E-commerce",
  subTitle = "Welcome to My Shop",
}: Props) {
  return (
    <div className={styles.jumbotron}>
      <div className="text-5xl font-mono font-black text-center">{title}</div>
      <div className="text-xl font-mono text-center">{subTitle}</div>
    </div>
  );
}
