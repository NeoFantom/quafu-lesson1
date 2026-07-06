# Quafu official docs inventory — lesson 1

Capture date: 2026-07-06 Asia/Shanghai worker run.

## Source URLs and raw evidence

- Official docs home: <https://quafu-sqc.readthedocs.io/en/latest/>
- Search index: <https://quafu-sqc.readthedocs.io/en/latest/search/search_index.json>
- Sitemap check: <https://quafu-sqc.readthedocs.io/en/latest/sitemap.xml>
- Saved raw files:
  - `sources/raw/quafu-docs/index.html`
  - `sources/raw/quafu-docs/index.article.txt`
  - `sources/raw/quafu-docs/search_index.json`
  - `sources/raw/quafu-docs/sitemap.xml`
  - `sources/raw/quafu-docs/capture-metadata.json`

## Page inventory

The official ReadTheDocs site currently exposes a single lesson-relevant MkDocs page, `Home`, with four sections:

1. **Introduction** — Quafu is described as a stable, open-access superconducting quantum computing cloud for developing quantum algorithms and applications.
2. **Installation** — install `QuarkStudio` with `pip install quarkstudio`; Python `>=3.12` is stated as required.
3. **Quick Guide** — initialize `Task('token')`, check backend queue status with `tmgr.status()`, submit an OpenQASM 2.0 task with `tmgr.run(task)`, and retrieve results with `tmgr.result(tid)`.
4. **Technical Support** — contact email is listed as `quafu_ts@baqis.ac.cn`.

## Lesson-relevant facts to preserve

- Use **QuarkStudio** as the Python entry point for direct backend submission.
- Treat the API token as a secret. The docs say tokens expire after **30 days**.
- The docs say each user can submit **1000 tasks per day**; excess tasks may queue to later days.
- `tmgr.status()` returns backend queue state: numeric queue length, `Offline`, or `Maintenance`.
- Task submission is asynchronous: `tmgr.run(task)` returns a task id immediately; students must save it.
- A result dictionary includes counts, optional corrected counts, transpiled circuit, status, task id, errors, finish time, and qlisp/debug representation.
- Supported task options in the docs include compiler choice, readout correction, dynamical decoupling, and target qubits.

## Lesson-safety notes

- Never place a real token in tutorial files. Use placeholders such as `YOUR_QUAFU_TOKEN`.
- Keep public tutorial language to “Quafu”. Do not use the platform's Chinese name.
- Avoid competition judging, review, or registration content; none was needed from this docs page.
- The OpenQASM snippet in the source page declares `qreg q[5]` while using `q[5]`; for classroom code, use a corrected six-qubit register or restrict indices to `q[0]`–`q[4]`.

## Natural Chinese summary for Lesson 1

Quafu 的第一课应让学员完成一条最短闭环：安装 QuarkStudio，准备自己的 Quafu API token，查看后端排队状态，提交一个 OpenQASM 2.0 小电路，保存返回的任务 id，再用任务 id 取回测量计数与运行状态。教学重点是让学员理解云端量子任务的工作流：**写电路 → 选后端 → 提交异步任务 → 等待队列执行 → 拉取结果 → 解读 counts**。

