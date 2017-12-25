# JSON数据
```javascript
// 案例1
{
	"title": "恒大海上威尼斯",
	"desc":  "恒大海上威尼斯\n六年精髓，醉美碧海银滩",
	"img":   "http://placehold.it/400x200/ccc/999",
	"format": ["jpg"]
}
```

数据绑定在`json`对象内

在页面内部 `HTML` 或 `组件` 套用需在前面加 `json.`

例如 `案例1` 中如需使用 `title` 字段: `json.title`


# 组件

#### 单行文本框 e-text
案例:

`<e-text v-model="json.title"></e-text>`

参数:
```javascript
v-model: json数据
```
输出:
```javascript
<span class="e-pos-rep">
	<span>恒大海上威尼斯</span>
</span>
```

#### 多行文本框 e-textarea
案例:

`<e-textarea v-model="json.desc"></e-textarea>`

参数:
```javascript
v-model: json数据
```
输出: 换行符会转化成多行 `<p>` 标签
```javascript
<div class="e-pos-rep">
	<p>恒大海上威尼斯</p>
	<p>六年精髓，醉美碧海银滩</p>
</div>
```

#### 图片 e-image
案例:

`<e-image v-model="json.img" max-size="150" :format="json.format"></e-image>`

参数:
```javascript
v-model: json数据
max-size: 图片最大限制, 单位KB
format: 图片类型限制, 数组格式 例: ['jpg', 'jpeg', 'png', 'gif']
```
输出: 换行符会转化成多行 `<p>` 标签
```javascript
<div class="e-pos-rep e-image">
	<img src="http://placehold.it/800x320/ccc/999">
</div>
```

#### 背景图 e-bgimage
案例:

```javascript
<e-bgimage v-model="json.img" e-class="banner" max-size="100" :format="json.format">
	<p>你好</p>
</e-bgimage>
```

参数:
```javascript
// 支持内部嵌入 HTML
v-model: json数据
e-class: 样式继承
max-size: 图片最大限制, 单位KB
format: 图片类型限制, 数组格式 例: ['jpg', 'jpeg', 'png', 'gif']
```
输出: 换行符会转化成多行 `<p>` 标签
```javascript
<div class="e-pos-rep e-image">
	<div class="banner" style="background-image:url(http://placehold.it/800x320/ccc/999);">
		<p>你好</p>
	</div>
</div>
```


# 占位图 Placehold.it 说明文档

案例:

`http://placehold.it/{a}/{b}/{c}`

参数:
```javascript
a: 尺寸:  400x200
b: 背景色: fff 或 ffffff
c: 文字色: fff 或 ffffff
```


#### 测试链接
[点我](http://placehold.it/400x200/ccc/999)

![http://placehold.it/400x200/ccc/999](http://placehold.it/400x200/ccc/999)