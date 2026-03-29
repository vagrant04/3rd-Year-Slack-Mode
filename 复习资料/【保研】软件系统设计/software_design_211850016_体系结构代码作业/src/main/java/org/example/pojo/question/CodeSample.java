package org.example.pojo.question;

import lombok.Getter;

@Getter
public class CodeSample {
  String[] input;
  String output;

  public CodeSample(String input, String output) {
    this.input = input.split("\\s");
    this.output = output;
  }
}
