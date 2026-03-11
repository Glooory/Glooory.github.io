"use client";

import { useMemo, useState } from "react";
import { Button, Slider } from "@mantine/core";
import { CodeBlock } from "@/components/CodeBlock";
import styles from "./styles.module.css";

const sliderRange: [number, number] = [1_000, 100_000];

const SpreadPerformanceDemo = () => {
  const [calculating, setCalculating] = useState(false);
  const [loopCount, setLoopCount] = useState(sliderRange[0]);
  const [useSpreadCost, setUseSpreadCost] = useState(0);
  const [useIfCost, setUseIfCost] = useState(0);

  const files = useMemo(
    () => Array.from({ length: loopCount }).map((_, index) => ({ folder: "dummy", path: `file_path_${index}` })),
    [loopCount]
  );

  const startUseSpreadCase = () => {
    const startTime = performance.now();
    const folderFilesMap: Record<string, string[]> = {};
    files.forEach((file) => {
      const { folder, path } = file;
      folderFilesMap[folder] = [...(folderFilesMap[folder] ?? []), path];
    });
    setUseSpreadCost(performance.now() - startTime);
  };

  const startUseIfCase = () => {
    const startTime = performance.now();
    const folderFilesMap: Record<string, string[]> = {};
    files.forEach((file) => {
      const { folder, path } = file;
      if (!folderFilesMap[folder]) {
        folderFilesMap[folder] = [];
      }
      folderFilesMap[folder].push(path);
    });
    setUseIfCost(performance.now() - startTime);
  };

  const onStartClick = () => {
    setCalculating(true);
    setTimeout(() => {
      startUseSpreadCase();
      startUseIfCase();
      setCalculating(false);
    }, 100);
  };

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.column}>
          <h6>使用展开运算符：</h6>
          <CodeBlock>
            <code>
              {`const folderFilesMap: Record<string, string[]> = {};
            
files.forEach((file) => {
  const { folder, path } = file;
  
  folderFilesMap[folder] = [
    ...(folderFilesMap[folder] ?? []),
    path
  ];
  
});`}
            </code>
          </CodeBlock>
          <div>耗时: {calculating ? "计算中..." : `${useSpreadCost}(ms)`}</div>
        </div>
        <div className={styles.column}>
          <h6>使用 if 判断：</h6>
          <CodeBlock>
            <code>
              {`const folderFilesMap: Record<string, string[]> = {};
            
todos.forEach((todo) => {
  const { folder, path } = file;
  
  if (!folderFilesMap[folder]) {
    folderFilesMap[folder] = [];
  }
  folderFilesMap[folder].push(path);
  
});`}
            </code>
          </CodeBlock>
          <div>耗时: {calculating ? "计算中..." : `${useIfCost}(ms)`}</div>
        </div>
      </div>
      <div className={styles["slider-container"]}>
        <p>{`循环次数: ${loopCount}`}</p>
        <Slider
          label={(value) => `循环次数: ${value}`}
          value={loopCount}
          min={sliderRange[0]}
          max={sliderRange[1]}
          step={1000}
          marks={[
            { value: sliderRange[0], label: sliderRange[0] },
            { value: sliderRange[1], label: sliderRange[1] },
          ]}
          onChange={setLoopCount}
        />
      </div>
      <div>
        <Button fullWidth variant="outline" loading={calculating} onClick={onStartClick}>
          开始测试耗时
        </Button>
      </div>
    </div>
  );
};

export default SpreadPerformanceDemo;
