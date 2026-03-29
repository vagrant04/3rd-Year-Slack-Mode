package org.example._enum;

import org.example.score.FixScoreStrategy;
import org.example.score.NothingScoreStrategy;
import org.example.score.PartialScoreStrategy;
import org.example.score.ScoreStrategy;

import java.util.HashMap;
import java.util.Map;

public enum MultiSelectScoreMode {
  nothing("nothing", new NothingScoreStrategy()),
  fix("fix", new FixScoreStrategy()),
  partial("partial", new PartialScoreStrategy());

  private static final Map<String, ScoreStrategy> strategyMap = new HashMap<>();

  static {
    for (MultiSelectScoreMode mode : MultiSelectScoreMode.values()) {
      strategyMap.put(mode.mode, mode.scoreStrategy);
    }
  }

  final String mode;
  final ScoreStrategy scoreStrategy;

  MultiSelectScoreMode(String mode, ScoreStrategy scoreStrategy) {
    this.mode = mode;
    this.scoreStrategy = scoreStrategy;
  }

  public static ScoreStrategy getScoreStrategy(String mode) {
    ScoreStrategy strategy = strategyMap.get(mode);
    if (strategy == null) {
      throw new IllegalArgumentException("Invalid score mode: " + mode);
    }
    return strategy;
  }

}