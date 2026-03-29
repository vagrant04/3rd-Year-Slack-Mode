package org.example.code.executor;

import java.util.concurrent.Callable;

public abstract class Executor implements Callable<Object> {
  String[] input;
  String output;
  Long timeLimit;

  public Executor(String[] input, String output, Long timeLimit) {
    this.input = input;
    this.output = output;
    this.timeLimit = timeLimit;
  }
}
