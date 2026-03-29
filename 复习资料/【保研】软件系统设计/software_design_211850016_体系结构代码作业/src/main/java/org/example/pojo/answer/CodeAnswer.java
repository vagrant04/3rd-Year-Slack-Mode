package org.example.pojo.answer;

import lombok.Getter;

import java.nio.file.Path;

@Getter
public class CodeAnswer extends Answer {
  private String language;
  private Path path;
  private String name;

  public CodeAnswer(Long questionId, String answers) {
    super(questionId, answers);
    this.path = Path.of(answers);
    this.name = answers.substring(answers.lastIndexOf("/") + 1, answers.lastIndexOf("."));
    this.language = answers.substring(answers.lastIndexOf(".") + 1);
    this.language = Character.toUpperCase(this.language.charAt(0)) + this.language.substring(1).toLowerCase();
  }

  @Override
  public void log() {
    System.out.println("QuestionId: " + questionId);
    System.out.println("Path: " + path);
    System.out.println("Language: " + language);
  }
}
