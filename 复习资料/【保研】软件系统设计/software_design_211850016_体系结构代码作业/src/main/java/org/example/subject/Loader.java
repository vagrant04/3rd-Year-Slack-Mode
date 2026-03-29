package org.example.subject;

import lombok.Getter;
import lombok.SneakyThrows;
import org.example.factory.parser.ParserFactory;
import org.example.persist.PersistStrategy;
import org.example.pojo.Exam;
import org.example.pojo.Submission;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;

@Getter
public class Loader extends Subject {

  public final String examsPath;
  public final String answersPath;
  public final Map<Long, Exam> exams = new HashMap<>();
  public final Set<Submission> submissions = new HashSet<>();
  final String parserPrefix = "org.example.factory.parser.";
  PersistStrategy persistStrategy;

  public Loader(String casePath, PersistStrategy persistStrategy) {
    this.examsPath = casePath + System.getProperty("file.separator") + "exams";
    this.answersPath = casePath + System.getProperty("file.separator") + "answers";
    this.persistStrategy = persistStrategy;
  }

  @SneakyThrows
  public void loadExams() {
    try (Stream<Path> paths = Files.list(Paths.get(examsPath))) {
      paths.filter(Files::isRegularFile).forEach(file -> {
        String fileName = file.getFileName().toString();
        String suffix = fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
        try {
          Class<?> c = Class.forName(parserPrefix + suffix + "ParserFactory");
          ParserFactory parserFactory = (ParserFactory) c.getDeclaredConstructor().newInstance();
          Exam exam = parserFactory.parseExam(file.toString());
          exams.put(exam.getId(), exam);
        } catch (ClassNotFoundException e) {
          System.out.println("Unsupported file format when load exams: " + suffix);
        } catch (Exception e) {
          e.printStackTrace();
        }
      });
    }
  }

  @SneakyThrows
  public void loadSubmissions() {
    try (Stream<Path> paths = Files.list(Paths.get(answersPath))) {
      paths.filter(Files::isRegularFile).forEach(file -> {
        String fileName = file.getFileName().toString();
        String suffix = fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase();
        try {
          Class<?> c = Class.forName(parserPrefix + suffix + "ParserFactory");
          ParserFactory parserFactory = (ParserFactory) c.getDeclaredConstructor().newInstance();
          Submission submission = parserFactory.parseSubmission(file.toString());
          Arrays.stream(submission.getAnswers()).forEach(answer -> {
            if (answer.getAnswers().startsWith("code-answer"))
              answer.setAnswers(answersPath.replaceAll("\\\\", "/") + "/" + answer.getAnswers());
          });
          submissions.add(submission);
        } catch (ClassNotFoundException e) {
          System.out.println("Unsupported file format when load submissions: " + suffix);
        } catch (Exception e) {
          e.printStackTrace();
        }
      });
    }
  }
}
