package org.example.persist;

public abstract class PersistStrategy {

  public abstract void persistTitle(String title);

  public abstract void persistScore(Long examId, Long studentId, Long score);

  public abstract void persistComplexity(Long examId, Long studentId, Long qId, Long complexity);
}
