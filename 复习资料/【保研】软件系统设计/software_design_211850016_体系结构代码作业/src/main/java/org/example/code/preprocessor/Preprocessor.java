package org.example.code.preprocessor;

import java.nio.file.Path;
import java.util.concurrent.Callable;

public abstract class Preprocessor implements Callable<Object> {
  Path src;
  Path dst;

  public Preprocessor(Path src, Path dst) {
    this.src = src;
    this.dst = dst;
  }
}
