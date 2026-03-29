package org.example.score;

import org.example.code.executor.Executor;
import org.example.code.preprocessor.Preprocessor;
import org.example.pojo.answer.Answer;
import org.example.pojo.answer.CodeAnswer;
import org.example.pojo.question.CodeQuestion;
import org.example.pojo.question.CodeSample;
import org.example.pojo.question.Question;
import org.example.utils.ThreadPool;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.concurrent.Future;

public class CodeScoreStrategy extends ScoreStrategy {

  private static final String codePrefix = "org.example.code.";
  private static final String preprocessorSuffix = "preprocessor.";
  private static final String executorSuffix = "executor.";
  private static final Path classPath = Path.of(".classes/");

  @Override
  public Long cal(Question question, Answer answer) {
    if (question instanceof CodeQuestion)
      return cal((CodeQuestion) question,
          new CodeAnswer(answer.getQuestionId(), answer.getAnswers()));
    throw new IllegalArgumentException("CodeScoreStrategy only supports CodeQuestion");
  }

  private Long cal(CodeQuestion question, CodeAnswer answer) {
    try {
      Class<?> preClass = Class.forName(codePrefix + preprocessorSuffix + answer.getLanguage() + "Preprocessor");
      Class<?> executorClass = Class.forName(codePrefix + executorSuffix + answer.getLanguage() + "Executor");
      Preprocessor preprocessor = (Preprocessor) preClass
          .getDeclaredConstructor(Path.class, Path.class)
          .newInstance(answer.getPath(), classPath);
      Future<?> preFuture = ThreadPool.getInstance().submit(preprocessor);
      if (!(Boolean) preFuture.get())
        return 0L;
      ArrayList<Executor> executors = new ArrayList<>();
      for (CodeSample sample : question.getSamples()) {
        Executor executor = (Executor) executorClass
            .getDeclaredConstructor(String[].class, String.class, Path.class, String.class, Long.class)
            .newInstance(sample.getInput(), sample.getOutput(), classPath, answer.getName(), question.getTimeLimit());
        executors.add(executor);
      }
      ArrayList<Future<Object>> exeFutures = ThreadPool.getInstance().submitAll(executors);
      boolean allPassed = true;
      for (Future<Object> future : exeFutures) {
        if (!(Boolean) future.get())
          allPassed = false;
      }
      return allPassed ? question.getPoints() : 0L;
    } catch (ClassNotFoundException e) {
      System.out.println("Unsupported language: " + answer.getLanguage());
    } catch (Exception e) {
      e.printStackTrace();
    }
    return 0L;
  }
}
