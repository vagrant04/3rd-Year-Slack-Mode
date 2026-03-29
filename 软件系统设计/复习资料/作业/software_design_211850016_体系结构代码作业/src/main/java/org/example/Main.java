package org.example;

import org.example.observer.ComplexityAnalyst;
import org.example.observer.Judger;
import org.example.persist.CSVPersistStrategy;
import org.example.persist.PersistStrategy;
import org.example.subject.Loader;

public class Main {
  public static void main(String[] args) {
    String casePath = args[0];
    String output = args[1];
    // 创建持久化策略
    PersistStrategy persistStrategy = new CSVPersistStrategy(output);
    // 创建加载器
    Loader loader = new Loader(casePath, persistStrategy);
    // 加载数据
    loader.loadExams();
    loader.loadSubmissions();
    // 添加评测或分析的观察者
    if (output.contains("complexity")) {
      // 创建圈复杂度分析器
      loader.addObserver(new ComplexityAnalyst());
      persistStrategy.persistTitle("examId, stuId, qId, complexity");
    } else {
      // 创建评测器
      loader.addObserver(new Judger());
      persistStrategy.persistTitle("examId, stuId, score");
    }
    // 通知观察者
    loader.notifyObservers();
  }
}