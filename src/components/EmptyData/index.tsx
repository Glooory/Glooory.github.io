import clsx from "clsx";
import styles from "./styles.module.css";

export interface EmptyDataProps {
  classNames?: {
    root?: string;
  };
}

const EmptyData = (props: EmptyDataProps) => {
  const { classNames } = props;

  return <div className={clsx(styles["empty-data"], classNames?.root)}>内容准备中...</div>;
};

export default EmptyData;
