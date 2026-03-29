package org.example.pojo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.pojo.question.Question;

@Getter
@AllArgsConstructor
public class Exam {
  private Long id;
  private String title;
  private Long startTime;
  private Long endTime;
  private Question[] questions;

  public void log() {
    System.out.println("ExamId: " + id);
    System.out.println("Title: " + title);
    System.out.println("Start Time: " + startTime);
    System.out.println("End Time: " + endTime);
    for (Question q : questions) {
      q.log();
    }
  }
}