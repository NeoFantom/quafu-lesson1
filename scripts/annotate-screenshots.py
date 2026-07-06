#!/usr/bin/env python3
"""Build public tutorial screenshots with stable URL bars and side callouts.

Raw account-specific platform captures are intentionally ignored by git under
sources/raw/platform-screens/. Public homepage captures are safe to track and
live under sources/raw/public-home-screens/.
"""
from __future__ import annotations

from pathlib import Path
from textwrap import wrap
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "site/assets/screenshots"
PLATFORM_RAW = ROOT / "sources/raw/platform-screens"
PUBLIC_RAW = ROOT / "sources/raw/public-home-screens"
OUT.mkdir(parents=True, exist_ok=True)

BAR_H = 56
PANEL_W = 430
BLUE = (15, 98, 254)
BLUE_D = (0, 67, 206)
ORANGE = (255, 171, 45)
WHITE = (255, 255, 255)
BLACK = (22, 22, 22)
GRAY = (82, 82, 82)
LIGHT = (247, 249, 252)
BORDER = (214, 224, 238)
MASK = (246, 248, 251)

FONT_SERIF_BOLD = "/usr/share/fonts/opentype/noto/NotoSerifCJK-Black.ttc"
FONT_SERIF_SEMI = "/usr/share/fonts/opentype/noto/NotoSerifCJK-SemiBold.ttc"
FONT_SANS_BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FONT_SANS = "/usr/share/fonts/opentype/noto/NotoSansCJK-Medium.ttc"
url_font = ImageFont.truetype(FONT_SANS_BOLD, 22)
num_font = ImageFont.truetype(FONT_SANS_BOLD, 22)
title_font = ImageFont.truetype(FONT_SERIF_BOLD, 24)
body_font = ImageFont.truetype(FONT_SERIF_SEMI, 19)
mask_font = ImageFont.truetype(FONT_SERIF_SEMI, 18)


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def draw_wrapped(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font, fill, max_px=290, line_gap=7) -> int:
    x, y = xy
    lines: list[str] = []
    for part in text.split("\n"):
        cur = ""
        for ch in part:
            test = cur + ch
            if cur and text_size(draw, test, font)[0] > max_px:
                lines.append(cur)
                cur = ch
            else:
                cur = test
        lines.append(cur)
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        _, h = text_size(draw, line or "国", font)
        y += h + line_gap
    return y


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def marker(draw: ImageDraw.ImageDraw, x: int, y: int, n: int):
    r = 18
    draw.ellipse((x - r, y - r, x + r, y + r), fill=BLUE, outline=WHITE, width=3)
    s = str(n)
    tw, th = text_size(draw, s, num_font)
    draw.text((x - tw / 2, y - th / 2 - 1), s, font=num_font, fill=WHITE)


def mask_box(draw, box, text=None):
    rounded(draw, box, 8, MASK, BORDER, 1)
    if text:
        tw, th = text_size(draw, text, mask_font)
        draw.text((box[0] + (box[2] - box[0] - tw) / 2, box[1] + (box[3] - box[1] - th) / 2 - 2), text, font=mask_font, fill=GRAY)


def annotate(raw: Path, out_name: str, url: str, callouts: list[dict], masks: list[tuple[tuple[int, int, int, int], str | None]] | None = None):
    im = Image.open(raw).convert("RGB")
    w, h = im.size
    canvas = Image.new("RGB", (w + PANEL_W, h + BAR_H), WHITE)
    canvas.paste(im, (0, BAR_H))
    draw = ImageDraw.Draw(canvas)

    # URL bar.
    draw.rectangle((0, 0, w + PANEL_W, BAR_H), fill=WHITE)
    draw.line((0, BAR_H - 1, w + PANEL_W, BAR_H - 1), fill=(225, 225, 225), width=1)
    draw.text((28, 16), url, font=url_font, fill=BLACK)

    # Side panel for explanations; labels never cover the screenshot content.
    px = w
    draw.rectangle((px, BAR_H, w + PANEL_W, h + BAR_H), fill=LIGHT)
    draw.line((px, BAR_H, px, h + BAR_H), fill=BORDER, width=2)
    draw.text((px + 28, BAR_H + 28), "看图顺序", font=title_font, fill=BLACK)

    for box, text in masks or []:
        x1, y1, x2, y2 = box
        mask_box(draw, (x1, y1 + BAR_H, x2, y2 + BAR_H), text)

    label_y = BAR_H + 78
    label_centers = []
    for idx, c in enumerate(callouts, start=1):
        label_h = 120 if len(c.get("body", "")) > 22 else 100
        top = label_y
        rounded(draw, (px + 24, top, w + PANEL_W - 24, top + label_h), 14, WHITE, BORDER, 1)
        marker(draw, px + 52, top + 34, idx)
        draw.text((px + 82, top + 18), c["title"], font=title_font, fill=BLACK)
        draw_wrapped(draw, (px + 82, top + 52), c.get("body", ""), body_font, GRAY, max_px=PANEL_W-130)
        label_centers.append((px + 24, top + label_h // 2))
        label_y += label_h + 16

    for idx, c in enumerate(callouts, start=1):
        tx, ty = c["xy"]
        tx2, ty2 = tx, ty + BAR_H
        if rect := c.get("rect"):
            x1, y1, x2, y2 = rect
            draw.rectangle((x1, y1 + BAR_H, x2, y2 + BAR_H), outline=ORANGE, width=4)
        marker(draw, tx2, ty2, idx)
        lx, ly = label_centers[idx - 1]
        draw.line((tx2 + 22, ty2, lx, ly), fill=ORANGE, width=3)

    out = OUT / out_name
    # Palette only for large photographic public register page.
    if out_name == "00-register.png":
        canvas.quantize(colors=256, method=Image.Quantize.MEDIANCUT).save(out, optimize=True)
    else:
        canvas.save(out, optimize=True)
    print(out.relative_to(ROOT), canvas.size, out.stat().st_size)


def main():
    annotate(PUBLIC_RAW / "register-raw.png", "00-register.png", "https://quafu-sqc.baqis.ac.cn/register", [
        {"title": "输入邮箱", "body": "用户名在上方填写，邮箱用于激活和找回密码。", "xy": (540, 396), "rect": (520, 376, 920, 414)},
        {"title": "设置密码", "body": "填写 Password 和 Confirm password。", "xy": (540, 458), "rect": (520, 438, 920, 538)},
        {"title": "发送验证邮件", "body": "点击 Sign Up，系统向邮箱发送激活链接。", "xy": (720, 582), "rect": (520, 562, 920, 602)},
        {"title": "去邮箱激活", "body": "打开邮件中的激活链接，再回到登录页。", "xy": (720, 646), "rect": (615, 636, 850, 654)},
    ])
    annotate(PLATFORM_RAW / "home-raw.png", "01-home-dashboard.png", "https://quafu-sqc.baqis.ac.cn/framework/home", [
        {"title": "看资源状态", "body": "Statistics 显示额度、token 有效期和 Jupyter 状态。", "xy": (150, 188), "rect": (64, 158, 596, 300)},
        {"title": "选可用 QPU", "body": "Available QPUs 显示状态、队列、qubits 和误差。", "xy": (460, 672), "rect": (64, 572, 960, 790)},
        {"title": "刷新 token", "body": "token 到期时在右上角刷新，公开材料隐藏真实 token。", "xy": (1296, 26), "rect": (1278, 8, 1314, 44)},
    ], masks=[((72, 8, 312, 48), "学员账号"), ((732, 8, 956, 48), "非教学入口已隐藏"), ((1074, 8, 1274, 48), "凭证已隐藏"), ((0, 398, 50, 472), None)])
    annotate(PLATFORM_RAW / "composer-raw.png", "02-composer.png", "https://quafu-sqc.baqis.ac.cn/framework/composer", [
        {"title": "选择量子门", "body": "从左侧门库选择 H、X、RY、RZ、CX 等操作。", "xy": (150, 126), "rect": (64, 56, 240, 323)},
        {"title": "放到线路", "body": "把门放到 qubit wire，检查控制位和目标位。", "xy": (620, 168), "rect": (294, 98, 1160, 326)},
        {"title": "读 OpenQASM", "body": "右侧代码区同步生成可提交的 OpenQASM。", "xy": (1210, 132), "rect": (1175, 56, 1426, 326)},
        {"title": "看输出态", "body": "下方图表用于建立模拟输出的直觉。", "xy": (460, 470), "rect": (300, 396, 1306, 672)},
    ], masks=[((0, 399, 50, 472), None)])
    annotate(PLATFORM_RAW / "tasks-raw.png", "03-tasks.png", "https://quafu-sqc.baqis.ac.cn/framework/tasks", [
        {"title": "按 Task ID 查找", "body": "任务提交后保存 task id，优先用它定位记录。", "xy": (170, 28), "rect": (82, 16, 310, 48)},
        {"title": "刷新状态", "body": "点击右上角刷新或搜索，更新异步任务状态。", "xy": (1215, 30), "rect": (1180, 16, 1260, 48)},
        {"title": "处理 token 过期", "body": "看到过期提示时回 Home 刷新 token。", "xy": (720, 90), "rect": (470, 50, 970, 110)},
        {"title": "空列表状态", "body": "首次运行前列表可为空，提交后再回来看状态。", "xy": (178, 124), "rect": (70, 108, 358, 140)},
    ], masks=[((0, 399, 50, 472), None)])
    annotate(PLATFORM_RAW / "user-raw.png", "04-user.png", "https://quafu-sqc.baqis.ac.cn/framework/user", [
        {"title": "用户信息", "body": "只说明入口作用，截图和共享屏幕隐藏个人信息。", "xy": (100, 28), "rect": (70, 16, 150, 40)},
        {"title": "JupyterLab 服务", "body": "这里进入或管理网页内的 Jupyter 服务。", "xy": (230, 28), "rect": (170, 16, 310, 40)},
        {"title": "更新密码", "body": "需要时在 Update Password 页修改密码。", "xy": (380, 28), "rect": (318, 16, 470, 40)},
    ], masks=[((158, 60, 421, 177), "账号信息已隐藏"), ((0, 399, 50, 472), None)])
    annotate(PLATFORM_RAW / "jupyter-raw.png", "05-jupyter.png", "https://quafu-sqc.baqis.ac.cn/framework/jupyter", [
        {"title": "文件浏览器", "body": "左侧查看 notebook、脚本和工作目录。", "xy": (150, 55), "rect": (82, 42, 320, 184)},
        {"title": "新建 Notebook", "body": "点击 Python 3 创建交互式练习环境。", "xy": (510, 210), "rect": (458, 162, 562, 264)},
        {"title": "终端和脚本", "body": "也可以新建 Terminal、Text File 或 Python File。", "xy": (760, 560), "rect": (458, 530, 1030, 632)},
        {"title": "设置面板", "body": "右侧齿轮用于打开设置与扩展面板。", "xy": (1424, 54), "rect": (1408, 36, 1438, 70)},
    ], masks=[((0, 399, 50, 472), None)])
    annotate(PUBLIC_RAW / "home-raw.png", "06-public-home.png", "https://quafu-sqc.baqis.ac.cn/home", [
        {"title": "点 SQCLab 登录", "body": "误入后台主页时，点击 SQCLab 进入登录流程。", "xy": (152, 80), "rect": (110, 66, 198, 94)},
        {"title": "点 here 看文档", "body": "蓝色 here 跳到英文文档。", "xy": (792, 80), "rect": (772, 70, 812, 92)},
        {"title": "看芯片卡片", "body": "卡片显示状态、队列、qubits 和误差。", "xy": (250, 220), "rect": (20, 110, 480, 342)},
        {"title": "点击芯片详情", "body": "点击任意芯片卡片进入 chip details 页面。", "xy": (440, 156), "rect": (414, 136, 456, 176)},
    ])
    annotate(PUBLIC_RAW / "chip-detail-raw.png", "07-chip-detail.png", "https://quafu-sqc.baqis.ac.cn/chipDetails?chip=Baihua", [
        {"title": "返回列表", "body": "Back 回到 /home 的芯片卡片列表。", "xy": (82, 30), "rect": (30, 16, 134, 46)},
        {"title": "芯片 Details", "body": "查看 qubits、queue、basis gates、T1/T2 和状态。", "xy": (475, 190), "rect": (30, 88, 1846, 348)},
        {"title": "校准数据", "body": "Map view / Table view 展示校准数据。", "xy": (150, 432), "rect": (30, 410, 310, 458)},
        {"title": "下载数据", "body": "右侧下载按钮可导出校准数据或视图。", "xy": (1820, 432), "rect": (1788, 414, 1844, 456)},
        {"title": "芯片拓扑", "body": "中间拓扑图帮助判断 qubit 连接关系。", "xy": (1120, 716), "rect": (642, 468, 1600, 1116)},
    ])


if __name__ == "__main__":
    main()
