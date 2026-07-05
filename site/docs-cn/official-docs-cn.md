# Quafu 官方文档中文导读（Lesson 1 草稿）

> 来源：Quafu 官方文档 <https://quafu-sqc.readthedocs.io/en/latest/>。本页是面向 2026-07-07 Lesson 1 学员的自然中文导读，不包含真实账号凭证。

## 1. 你今天要学会什么

Lesson 1 的目标是跑通 Quafu 的最小工作流：安装 QuarkStudio，用自己的 Quafu token 初始化任务管理器，查看后端队列，提交一个 OpenQASM 2.0 电路，保存任务 id，并取回测量结果。

## 2. 安装 QuarkStudio

官方文档说明 QuarkStudio 支持 Windows、macOS 和 Linux，并要求 Python `>=3.12`。

```bash
pip install quarkstudio
```

课堂建议：先确认 Python 版本，再安装。安装完成后，后续 Python 脚本会通过 `quark` 包里的 `Task` 类与 Quafu 后端交互。

## 3. 准备 token：只用占位符，不写真实值

初始化任务管理器时需要 Quafu token：

```python
from quark import Task

tmgr = Task("YOUR_QUAFU_TOKEN")
```

请注意：token 是个人验证密钥，不能发到群里、不能写进公开代码、也不能提交到仓库。官方文档说明 token 有效期为 30 天；过期后需要重新申请。

## 4. 先看后端状态，再决定提交到哪里

提交任务前，先查看各后端状态：

```python
print(tmgr.status())
```

返回值通常是一个字典。后端名后面的数字表示当前队列里还有多少任务；`Offline` 表示暂不可用；`Maintenance` 表示维护中。课堂上优先选择排队少、状态正常的后端。

## 5. 准备一个 OpenQASM 2.0 电路

官方文档使用 OpenQASM 2.0 字符串提交任务。课堂版建议使用索引自洽的示例：

```python
circuit = """
OPENQASM 2.0;
include "qelib1.inc";
qreg q[6];
creg meas[4];
h q[2];
cx q[2],q[3];
cx q[3],q[4];
cx q[4],q[5];
measure q[2] -> meas[0];
measure q[3] -> meas[1];
measure q[4] -> meas[2];
measure q[5] -> meas[3];
"""
```

## 6. 组装任务并提交

任务是一个 Python 字典。`chip` 是目标后端，`name` 是任务名，`shots` 是采样次数，`options` 用来设置编译器、读出误差校正、动态去耦和目标量子比特等选项。

```python
task = {
    "chip": "Dongling",
    "name": "Lesson1Demo",
    "circuit": circuit,
    "shots": 1024,
    "options": {
        "compiler": "quarkcircuit",
        "correct": False,
        "open_dd": None,
        "target_qubits": []
    }
}

tid = tmgr.run(task)
print("task id:", tid)
```

Quafu 的任务提交是异步的：`tmgr.run(task)` 返回任务 id 后，程序不需要一直等待硬件执行完成。请务必保存 `tid`，后面取结果要用它。

## 7. 用任务 id 取回结果

```python
res = tmgr.result(tid)
print(res["status"])
print(res["count"])
```

结果字典里最重要的是：

- `count`：各测量 bitstring 出现的次数；
- `corrected`：如开启校正，可能包含校正后的结果；
- `transpiled`：实际下发到后端前的转译电路；
- `status`：任务状态；
- `tid`：任务 id；
- `error`：错误信息；
- `finished`：完成时间；
- `qlisp`：便于调试的电路描述。

## 8. 第一课检查清单

- [ ] 已安装 Python `>=3.12`。
- [ ] 已安装 QuarkStudio。
- [ ] 有自己的 Quafu token，但没有把真实 token 写进文件。
- [ ] 会用 `tmgr.status()` 查看后端队列。
- [ ] 会提交一个小型 OpenQASM 2.0 任务。
- [ ] 保存了任务 id。
- [ ] 会用 `tmgr.result(tid)` 读取 `status` 和 `count`。

## 9. 技术支持

官方文档列出的技术支持邮箱：`quafu_ts@baqis.ac.cn`。
