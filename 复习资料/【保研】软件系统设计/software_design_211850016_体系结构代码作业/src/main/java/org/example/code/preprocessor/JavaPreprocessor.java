package org.example.code.preprocessor;

import java.nio.file.Files;
import java.nio.file.Path;

public class JavaPreprocessor extends Preprocessor {

  public JavaPreprocessor(Path src, Path dst) {
    super(src, dst);
  }

  @Override
  public Boolean call() throws Exception {
    Files.createDirectories(dst);
    ProcessBuilder builder = new ProcessBuilder("javac", "-d", dst.toString(), src.toString());
    Process process = builder.start();
    int status = process.waitFor();
    if (status != 0) {
      System.out.println("Compile failed: " + src.toString());
      return false;
    }
    return true;
  }
}
