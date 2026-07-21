---
title: Python
date: 2026/01/01
article: false
---

## 概述

Python 是一种**高级、通用、解释型**的编程语言。Python 是当今世界上最受欢迎的编程语言之一，广泛应用于人工智能、数据科学、后端开发等多个领域

核心特性：

- **易于学习：** 语法接近自然语言（英语），极其适合编程初学者
- **解释型语言：** 代码在运行时由解释器逐行执行，无需像 C 语言那样经历复杂的编译过程，调试方便
- **动态类型：** 变量不需要声明类型，增加了开发的灵活性。

应用领域：

- **人工智能与机器学习：** Python 是 AI 领域的首选语言。拥有 **TensorFlow**、**PyTorch** 和 **Scikit-learn** 等顶级框架
- **数据科学与分析：** **Pandas**、**NumPy** 和 **Matplotlib** 使得处理海量数据和生成可视化图表变得简单高效
- **Web 开发：** 拥有 **Django**（重量级、全功能）和 **Flask**（轻量级、灵活）等成熟的后端框架
- **自动化脚本：** 无论是文件批量处理、网络爬虫还是系统运维，Python 都是编写自动化任务的利器
- **科学计算：** 广泛应用于物理、生物等学科的数值模拟与复杂计算

## 安装

安装链接：

- Windows：[python_windows](https://www.python.org/downloads/windows/)

- Mac：

查询 Python 版本：

```sehll
python
```

## 数据类型

Python 有五个标准的数据类型：

- Numbers（数字）
- String（字符串）
- List（列表）
- Tuple（元组）
- Dictionary（字典）

### Numbers-数字

其中，数字类型又可分为：int（有符号整型）、long（长整型，可代表八进制和十六进制）、float（浮点型）、complex（复数）

| int | long      | float | complex              |
| --- | --------- | ----- | -------------------- |
| 10  | 51924361L | 0.0   | a + bj、complex(a,b) |

> **注意：**long 类型只存在于 Python2.X 版本中，在 2.2 以后的版本中，int 类型数据溢出后会自动转为 long 类型。在 Python3.X 版本中 long 类型被移除，使用 int 替代。

### String-字符串

Python 的字符串下标有 2 种取值方式：

- 从左到右索引默认 0 开始的，最大范围是字符串长度少 1
- **从右到左索引默认-1 开始的，最大范围是字符串开头**

```python
	   a   b   c   d   e   f   g
第一种	 0   1   2   3   4   5   6
第二种 -7  -6   -5  -4  -3  -2  -1
```

截取字符串方式：

- **[头下标:尾下标]**：左开右闭
- 加号 **+** 是列表连接运算符，星号 **\*** 是重复操作

```python
print(str[2:5])      # 输出字符串中第三个到第五个的字符串
print(str[2:])       # 输出从第三个字符开始的字符串
print(str * 2)       # 输出字符串两次
print(str + "TEST")  # 输出连接的字符串
```

### List-列表

截取列表方式，同上字符串

```python
list = [ 'runoob', 786 , 2.23, 'john', 70.2 ]
tinylist = [123, 'john']

print(list)               # 输出完整列表
print(list[0])            # 输出列表的第一个元素
print(list[1:3])          # 输出第二个至第三个元素
print(list[2:])           # 输出从第三个开始至列表末尾的所有元素
print(tinylist * 2)       # 输出列表两次
print(list + tinylist)    # 打印组合的列表
```

修改列表，append()方法

删除列表，del 语句

```python
list = []          ## 空列表
list.append('Google')   ## 使用 append() 添加元素
list.append('Runoob')
print(list)

del list[1] 	# 删除第二个元素
```

### Tuple-元组

元组，类似于 List（列表），使用 () 标识，内部元素用 , 隔开，不能二次赋值

```python
tuple = ( 'runoob', 786 , 2.23, 'john', 70.2 )
tinytuple = (123, 'john')

print(tuple)               # 输出完整元组
print(tuple[0])            # 输出元组的第一个元素
print(tuple[1:3])          # 输出第二个至第四个（不包含）的元素
print(tuple[2:])           # 输出从第三个开始至列表末尾的所有元素
print(tinytuple * 2)       # 输出元组两次
print(tuple + tinytuple)   # 打印组合的元组
```

### Dictionary-字典

字典用"{ }"标识，字典由索引(key)和它对应的值 value 组成

列表是有序的对象集合，字典是无序的对象集合

```python
dict = {}
dict['one'] = "This is one"
dict[2] = "This is two"

tinydict = {'name': 'runoob', 'code': 6734, 'dept': 'sales'}

print(dict['one'])  # 输出键为'one' 的值
print(dict[2])  # 输出键为 2 的值
print(tinydict)  # 输出完整的字典
print(tinydict.keys())  # 输出所有键
print(tinydict.values())  # 输出所有值
```

## 基本语句

### 条件语句

```python
if 判断条件1:
    执行语句1
elif 判断条件2:
    执行语句2
elif 判断条件3:
    执行语句3
else:
    执行语句4
```

### 循环语句

```python
while 判断条件(condition)：
    执行语句
```

```python
for iterating_var in sequence:
   执行语句
```

# Matplotlib

## 概述

Matplotlib 是 Python 的绘图库，可以用来绘制各种静态，动态，交互式的图表

## 安装

安装命令：

```shell
pip install matplotlib
```

查询版本：

```python
import matplotlib

print(matplotlib.__version__)
```

## Pyplot

Pyplot 是 Matplotlib 的子库，绘图模块。给图像加上标记，生新的图像，在图像中产生新的绘图区域

常用方法：

- `plot()`：用于绘制线图和散点图
- `scatter()`：用于绘制散点图
- `bar()`：用于绘制垂直条形图和水平条形图
- `hist()`：用于绘制直方图
- `pie()`：用于绘制饼图
- `imshow()`：用于绘制图像
- `subplots()`：用于创建子图

通过两个坐标 (0,0) 到 (6,100) 来绘制一条线

```python
import matplotlib.pyplot as plt
import numpy as np

xpoints = np.array([0, 6])
ypoints = np.array([0, 100])

plt.plot(xpoints, ypoints)
plt.show()
```

结果：

![image-20251231170820736](https://img.haipeng-lin.cn/1767172101179.png)

## 绘图

### 标记

使用 **plot()** 方法的 **marker** 参数来定义图片的标记

举例：

```python
import matplotlib.pyplot as plt
import numpy as np

ypoints = np.array([1,3,4,5,8,9,6,1,3,4,5,2,4])

plt.plot(ypoints, marker = 'o')
plt.show()
```

效果：

![image-20251231171536102](https://img.haipeng-lin.cn/1767172536226.png)

### 绘图线

linestyle()：**ls**，值如下：

- solid：实线，默认值
- dotted：点虚线
- dashed：破折线
- dashdot：点划线
- None：不划线

### 轴标签、标题

- x 轴标签：xlabel()
- y 轴标签：ylabel()
- 标题：title()

## 柱状图

- bar()：绘制水平方向的柱状图
- barh()：绘制垂直方向的柱状图

参数如下

```shell
matplotlib.pyplot.bar(x, height, width=0.8, bottom=None, *, align='center', data=None, **kwargs)
```

**参数说明：**

- **x**：浮点型数组，柱形图的 x 轴数据
- **y**：浮点型数组，柱形图的 y 轴数据
- **height**：浮点型数组，柱形图的宽度（**barh**）
- **width**：浮点型数组，柱形图的宽度（**bar**）
- **bottom**：浮点型数组，底座的 y 坐标，默认 0
- **align**：柱形图与 x 坐标的对齐方式
  - 'center' 以 x 位置为中心，这是默认值
  - 'edge'：将柱形图的左边缘与 x 位置对齐。要对齐右边缘的条形，可以传递负数的宽度值及 align='edge'
- **kwargs：**：其他参数
