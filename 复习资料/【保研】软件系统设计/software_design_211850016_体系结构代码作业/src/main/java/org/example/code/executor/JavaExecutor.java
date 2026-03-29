package org.example.code.executor;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

public class JavaExecutor extends Executor {
  private Path classPath;
  private String className;

  public JavaExecutor(String[] input, String output, Path classPath, String className, Long timeLimit) {
    super(input, output, timeLimit);
    this.classPath = classPath;
    this.className = className;
  }

  @Override
  public Boolean call() throws Exception {
    List<String> command = new ArrayList<>(Arrays.asList("java", "-cp", classPath.toString(), className));
    command.addAll(Arrays.asList(input));
    ProcessBuilder builder = new ProcessBuilder(command);
    Process process = builder.start();
    boolean finished = process.waitFor(timeLimit, TimeUnit.MILLISECONDS);
    if (!finished) {
      process.destroyForcibly();
      System.out.println("Time limit exceeded: " + className);
      return false;
    }
    int status = process.exitValue();
    if (status != 0) {
      process.destroyForcibly();
      System.out.println("Runtime error: " + className);
      return false;
    }
    BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
    String actualOutput = reader.lines().collect(Collectors.joining("\n"));
    if (!actualOutput.trim().equals(output.trim())) {
      System.out.println("Wrong answer: " + className);
      System.out.println("Expected: " + output.trim() + " Actual: " + actualOutput.trim());
      return false;
    }
    return true;
  }
}
