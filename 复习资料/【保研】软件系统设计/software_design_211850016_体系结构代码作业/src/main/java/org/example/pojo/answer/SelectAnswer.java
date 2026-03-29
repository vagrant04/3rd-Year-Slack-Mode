package org.example.pojo.answer;

import lombok.Getter;

@Getter
public class SelectAnswer extends Answer {

  Long[] options;

  public SelectAnswer(Long questionId, String answers) {
    super(questionId, answers);
    Long[] results = new Long[answers.length()];
    for (int i = 0; i < answers.length(); i++) {
      char c = answers.charAt(i);
      assert c >= 'A' && c <= 'Z'
          : "Invalid answer: " + c + " at " + i + " in " + answers + " for question " + questionId + " (should be A-Z)";
      results[i] = (long) (c - 'A');
    }
    this.options = results;
  }

  @Override
  public void log() {
    System.out.println("QuestionId: " + questionId);
    System.out.println("Options: ");
    for (Long option : options) {
      System.out.print(option + " ");
    }
    System.out.println();
  }
}
