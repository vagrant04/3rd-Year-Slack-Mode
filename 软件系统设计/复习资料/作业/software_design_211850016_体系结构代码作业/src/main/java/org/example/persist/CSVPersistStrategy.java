package org.example.persist;

import lombok.SneakyThrows;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

public class CSVPersistStrategy extends PersistStrategy {

  private final File file;

  @SneakyThrows
  public CSVPersistStrategy(String path) {
    file = new File(path);
  }

  @Override
  @SneakyThrows
  public void persistTitle(String title) {
    BufferedWriter writer = new BufferedWriter(new FileWriter(file, false));
    writer.write(title);
    writer.newLine();
    writer.close();
  }

  @Override
  @SneakyThrows
  public void persistScore(Long examId, Long studentId, Long score) {
    BufferedWriter writer = new BufferedWriter(new FileWriter(file, true));
    writer.write(examId + "," + studentId + "," + score);
    writer.newLine();
    writer.close();
  }

  @Override
  @SneakyThrows
  public void persistComplexity(Long examId, Long studentId, Long qId, Long complexity) {
    BufferedWriter writer = new BufferedWriter(new FileWriter(file, true));
    writer.write(examId + "," + studentId + "," + qId + "," + complexity);
    writer.newLine();
    writer.close();
  }
}
