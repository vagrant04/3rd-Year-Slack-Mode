package org.example.observer;

import org.example.code.analyst.CCAnalyst;
import org.example.persist.PersistStrategy;
import org.example.pojo.Exam;
import org.example.pojo.Submission;
import org.example.pojo.answer.Answer;
import org.example.pojo.answer.CodeAnswer;
import org.example.pojo.question.CodeQuestion;
import org.example.pojo.question.Question;
import org.example.subject.Loader;
import org.example.subject.Subject;
import org.example.utils.ThreadPool;

import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.Future;

public class ComplexityAnalyst implements Observer {

  private static final String ccaPrefix = "org.example.code.analyst.";
  Map<Long, Exam> exams = new HashMap<>();
  Set<Submission> submissions = new HashSet<>();
  SortedMap<Long, SortedMap<Long, SortedMap<Long, Future<?>>>> codeComplexities = new TreeMap<>();
  PersistStrategy persistStrategy;

  @Override
  public void update(Subject subject) {
    if (subject instanceof Loader) {
      Loader loader = (Loader) subject;
      exams = loader.getExams();
      submissions = loader.getSubmissions();
      persistStrategy = loader.getPersistStrategy();
    }
    analyze();
  }

  private void analyze() {
    for (Submission submission : submissions) {
      Exam exam = exams.get(submission.getExamId());
      if (exam == null) {
        System.out.println("Exam not found: " + submission.getExamId());
        continue;
      }
      // 判断 “提交时间是否在考试时间范围内” 之后反而错了。。。
      // if (submission.getSubmitTime() >= exam.getStartTime() && submission.getSubmitTime() <= exam.getEndTime()) {
      for (Question question : exam.getQuestions()) {
        if (!(question instanceof CodeQuestion))
          continue;
        Answer answer = (Arrays.stream(submission.getAnswers())
            .filter(a -> a.getQuestionId().equals(question.getId())).findFirst().orElse(null));
        CodeAnswer codeAnswer = new CodeAnswer(answer.getQuestionId(), answer.getAnswers());
        try {
          Class<?> ccAnalstClass = Class.forName(ccaPrefix + codeAnswer.getLanguage() + "CCAnalyst");
          CCAnalyst ccAnalyst = (CCAnalyst) ccAnalstClass.getDeclaredConstructor(Path.class)
              .newInstance(codeAnswer.getPath());
          Future<?> ccFuture = ThreadPool.getInstance().submit(ccAnalyst);
          codeComplexities.computeIfAbsent(submission.getExamId(), key -> new TreeMap<>())
              .computeIfAbsent(submission.getStuId(), key -> new TreeMap<>()).put(question.getId(), ccFuture);
        } catch (ClassNotFoundException e) {
          System.out.println("Unsupported language: " + codeAnswer.getLanguage());
          continue;
        } catch (Exception e) {
          e.printStackTrace();
          continue;
        }
      }
      // }
    }
    codeComplexities.forEach(
        (examId, stuMap) -> stuMap.forEach((stuId, questionMap) -> questionMap.forEach((questionId, ccFuture) -> {
          try {
            Long complexity = (Long) ccFuture.get();
            System.out.println("ExamId: " + examId + ", StuId: " + stuId + ", QId: " + questionId + ", Complexity: "
                + complexity);
            persistStrategy.persistComplexity(examId, stuId, questionId, complexity);
          } catch (Exception e) {
            e.printStackTrace();
          }
        })));
  }
}