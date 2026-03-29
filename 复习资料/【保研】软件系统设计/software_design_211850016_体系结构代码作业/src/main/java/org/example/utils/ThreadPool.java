package org.example.utils;

import lombok.Getter;

import java.util.ArrayList;
import java.util.concurrent.*;

public class ThreadPool {
  @Getter
  private static final ThreadPool instance = new ThreadPool(5);
  private final WorkerThread[] workers;
  private final BlockingQueue<Runnable> taskQueue;

  private ThreadPool(int poolSize) {
    this.workers = new WorkerThread[poolSize];
    this.taskQueue = new LinkedBlockingQueue<>();

    for (int i = 0; i < poolSize; i++) {
      workers[i] = new WorkerThread();
      workers[i].start();
    }
  }

  public void execute(Runnable task) {
    taskQueue.add(task);
  }

  public <T> Future<T> submit(Callable<T> task) {
    FutureTask<T> futureTask = new FutureTask<>(task);
    execute(futureTask);
    return futureTask;
  }

  public <T> ArrayList<Future<T>> submitAll(ArrayList<? extends Callable<T>> tasks) {
    ArrayList<Future<T>> futures = new ArrayList<>(tasks.size());
    for (Callable<T> task : tasks) {
      futures.add(submit(task));
    }
    return futures;
  }

  public void shutdown() {
    for (WorkerThread worker : workers) {
      worker.interrupt();
    }
  }

  private class WorkerThread extends Thread {
    @Override
    public void run() {
      while (!isInterrupted()) {
        try {
          Runnable task = taskQueue.take();
          task.run();
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          break;
        }
      }
    }
  }
}