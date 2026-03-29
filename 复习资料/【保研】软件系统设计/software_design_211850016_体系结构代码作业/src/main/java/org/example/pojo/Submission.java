package org.example.pojo;

import lombok.Getter;
import org.example.pojo.answer.Answer;
import org.json.JSONObject;

@Getter
public class Submission {

  Long examId;
  Long stuId;
  Long submitTime;
  Answer[] answers;

  public Submission(JSONObject json) {
    this.examId = json.getLong("examId");
    this.stuId = json.getLong("stuId");
    this.submitTime = json.getLong("submitTime");
    this.answers = new Answer[json.getJSONArray("answers").length()];
    for (int i = 0; i < answers.length; i++) {
      answers[i] = new Answer(json.getJSONArray("answers").getJSONObject(i));
    }
  }

  public void log() {
    System.out.println("ExamId: " + examId);
    System.out.println("StudentId: " + stuId);
    System.out.println("Submit Time: " + submitTime);
    for (Answer a : answers) {
      a.log();
    }
  }
}
