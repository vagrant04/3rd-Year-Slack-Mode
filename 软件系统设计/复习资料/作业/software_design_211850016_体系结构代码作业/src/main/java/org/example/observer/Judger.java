package org.example.observer;

import lombok.Getter;
import org.example.persist.PersistStrategy;
import org.example.pojo.Exam;
import org.example.pojo.Submission;
import org.example.pojo.answer.Answer;
import org.example.pojo.question.Question;
import org.example.subject.Loader;
import org.example.subject.Subject;

import java.util.*;

@Getter
public class Judger implements Observer {

  Map<Long, Exam> exams = new HashMap<>();
  Set<Submission> submissions = new HashSet<>();
  PersistStrategy persistStrategy;
  SortedMap<Long, SortedMap<Long, Long>> examScores = new TreeMap<>();

  @Override
  public void update(Subject subject) {
    if (subject instanceof Loader) {
      Loader loader = (Loader) subject;
      exams = loader.getExams();
      submissions = loader.getSubmissions();
      persistStrategy = loader.getPersistStrategy();
      judge();
    }
  }

  private void judge() {
    for (Submission submission : submissions) {
      Exam exam = exams.get(submission.getExamId());
      if (exam == null) {
        System.out.println("Exam not found: " + submission.getExamId());
        continue;
      }
      Long score = 0L;
      if (submission.getSubmitTime() >= exam.getStartTime() && submission.getSubmitTime() <= exam.getEndTime()) {
        for (Question question : exam.getQuestions()) {
          Answer actualAnswer = Arrays.stream(submission.getAnswers())
              .filter(a -> a.getQuestionId().equals(question.getId())).findFirst().orElse(null);
          score += question.cal(actualAnswer);
        }
      }
      examScores.computeIfAbsent(exam.getId(), key -> new TreeMap<>()).put(submission.getStuId(), score);
    }
    examScores.forEach((examId, scoreMap) -> scoreMap.forEach((stuId, score) -> {
      System.out.println("ExamId: " + examId + ", StuId: " + stuId + ", Score: " + score);
      persistStrategy.persistScore(examId, stuId, score);
    }));
    System.out.println("Judging finished");
  }
}
