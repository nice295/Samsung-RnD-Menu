# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: ""
	author: "KyuhoLee"
	twitter: ""
	description: ""


audio = new Audio('add.mp3');
   
m = require "material-kit"
bg = new BackgroundLayer 

bar = new m.AppBar
	backgroundColor:"green"
	actions:["more_vert"]
	title: "냉장고 내부"
	menu: "arrow_back"
bar.constraints =
	top: -30

bar.menu.onClick ->
	window.location.href = "../index.html"

# Add items
fridge = new Layer
	image: "images/fridge.png"
fridge.constraints = 
	top: 155
	height: 547
	width: 384
m.layout.set()

guideBg = new Layer
	backgroundColor: m.color("grey300")
	shadowY: m.px(1)
	shadowColor: m.color("black")
guideBg.constraints = 
	top: 50
	height: 36
	width: m.px(360)
titleLabel = new m.Text
	color: m.color("black")
	text: "식재료를 실제 식재료에 놓을 수 있습니다."
	fontSize: 14
	superLayer:guideBg
	constraints:{top: 12, leading:8, width:m.px(360)}
m.layout.set()

## items background
itemBg = new Layer
	backgroundColor: "white"
	shadowY: m.px(1)
	shadowColor: m.color("grey200")

#
itemBg.constraints = 
	top: 86
	height: 70
	width: m.px(360)
m.layout.set()

# Add drag item
egg = new Layer
	superLayer:itemBg
	image: "images/egg.png"
egg.constraints = 
	leading: 8 + 80
	height: 48
	width: 48
m.layout.set()
egg.centerY()
eggText = new m.Text
	superLayer:egg
	text: "3일"
	fontSize:10
	color:"orange"
	constraints:{trailing: -24, width:20}
m.layout.set()
eggText.centerY()
eggDrop = new Layer
	borderRadius: 100
	backgroundColor: "orange"
	opacity: 0.50
eggDrop.constraints = 
	top: 450
	leading: 90
	width: 48
	height: 48
m.layout.set()
egg.bringToFront()

egg.draggable.enabled = true
egg.draggable.overdrag = false
egg.draggable.bounce = false
egg.draggable.momentum = false
egg.draggable.constraints =
	x: 0
	y: egg.y
	width: Screen.width
	height: Screen.height - egg.y
eggDrop.scale = 0.25

egg.states.add
	init:
		scale: 1.0
		x: egg.x
		y: egg.y
		animationOptions:
			curve: "spring"
	dragging:
		scale: 1.2
	drop:
		scale: 0.8
		x: eggDrop.x
		y: eggDrop.y - itemBg.y
		
eggDrop.states.add
	init:
		scale: 0.2
	dragging:
		scale: 1.0
	drop:
		scale: 0

egg.onDragStart ->
	eggDrop.animate "dragging",
		time: 0.3
		curve: "spring"
	egg.animate "dragging",
		time: 0.3
		curve: "spring"

egg.on Events.DragEnd, (event, draggable, layer) ->
	if Math.abs(eggDrop.y - (draggable.y + itemBg.y)) < m.px(30) && Math.abs(eggDrop.x - draggable.x) < m.px(30)
		eggDrop.animate "drop",
			time: 0.3
			curve: "spring"
		egg.animate "drop",
			time: 0.3
			curve: "spring"
		audio.play();
	else
		eggDrop.animate "init",
			time: 0.3
			curve: "spring"
		egg.animate "init",
			time: 0.3
			curve: "spring"
	
# =============
# Add drag item
chicken = new Layer
	superLayer:itemBg
	image: "images/chicken.png"
chicken.constraints = 
	leading: 8
	height: 48
	width: 48
m.layout.set()
chicken.centerY()
chickenText = new m.Text
	superLayer:chicken
	text: "1일"
	fontSize:10
	color:"orange"
	constraints:{trailing: -14, width: 20}
m.layout.set()
chickenText.centerY()
chickenDrop = new Layer
	borderRadius: 100
	backgroundColor: "orange"
	opacity: 0.50
chickenDrop.constraints = 
	top: 211
	leading: 278
	width: 48
	height: 48
m.layout.set()
chicken.bringToFront()

chicken.draggable.enabled = true
chicken.draggable.overdrag = false
chicken.draggable.bounce = false
chicken.draggable.momentum = false
chicken.draggable.constraints =
	x: 0
	y: chicken.y
	width: Screen.width
	height: Screen.height - chicken.y
chickenDrop.scale = 0.25

chicken.states.add
	init:
		scale: 1.0
		x: chicken.x
		y: chicken.y
		animationOptions:
			curve: "spring"
	dragging:
		scale: 1.2
	drop:
		scale: 0.8
		x: chickenDrop.x
		y: chickenDrop.y - itemBg.y
		
chickenDrop.states.add
	init:
		scale: 0.2
	dragging:
		scale: 1.0
	drop:
		scale: 0

chicken.onDrag ->
	#print "x: " + m.dp(chicken.x)
	#print "y: " + m.dp(chicken.y + itemBg.y)
		
chicken.onDragStart ->
	chickenDrop.animate "dragging",
		time: 0.3
		curve: "spring"
	chicken.animate "dragging",
		time: 0.3
		curve: "spring"

chicken.on Events.DragEnd, (event, draggable, layer) ->
	if Math.abs(chickenDrop.y - (draggable.y + itemBg.y)) < m.px(30) && Math.abs(chickenDrop.x - draggable.x) < m.px(30)
		chickenDrop.animate "drop",
			time: 0.3
			curve: "spring"
		chicken.animate "drop",
			time: 0.3
			curve: "spring"
		audio.play();
	else
		chickenDrop.animate "init",
			time: 0.3
			curve: "spring"
		chicken.animate "init",
			time: 0.3
			curve: "spring"	

# =============
# Add drag item
meat = new Layer
	superLayer:itemBg
	image: "images/meat.png"
meat.constraints = 
	leading: 160
	height: 48
	width: 52
m.layout.set()
meat.centerY()
meatText = new m.Text
	superLayer:meat
	text: "7일"
	fontSize:10
	color:"orange"
	constraints:{trailing: -20, width: 20}
m.layout.set()
meatText.centerY()
meatDrop = new Layer
	borderRadius: 100
	backgroundColor: "orange"
	opacity: 0.50
meatDrop.constraints = 
	top: 215
	leading: 135
	width: 48
	height: 48
m.layout.set()
meat.bringToFront()

meat.draggable.enabled = true
meat.draggable.overdrag = false
meat.draggable.bounce = false
meat.draggable.momentum = false
meat.draggable.constraints =
	x: 0
	y: meat.y
	width: Screen.width
	height: Screen.height - meat.y
meatDrop.scale = 0.25

meat.states.add
	init:
		scale: 1.0
		x: meat.x
		y: meat.y
		animationOptions:
			curve: "spring"
	dragging:
		scale: 1.2
	drop:
		scale: 0.8
		x: meatDrop.x
		y: meatDrop.y - itemBg.y
		
meatDrop.states.add
	init:
		scale: 0.2
	dragging:
		scale: 1.0
	drop:
		scale: 0

meat.onDrag ->
	#print "x: " + m.dp(meat.x)
	#print "y: " + m.dp(meat.y + itemBg.y)
		
meat.onDragStart ->
	meatDrop.animate "dragging",
		time: 0.3
		curve: "spring"
	meat.animate "dragging",
		time: 0.3
		curve: "spring"

meat.on Events.DragEnd, (event, draggable, layer) ->
	if Math.abs(meatDrop.y - (draggable.y + itemBg.y)) < m.px(30) && Math.abs(meatDrop.x - draggable.x) < m.px(30)
		meatDrop.animate "drop",
			time: 0.3
			curve: "spring"
		meat.animate "drop",
			time: 0.3
			curve: "spring"
		audio.play();
	else
		meatDrop.animate "init",
			time: 0.3
			curve: "spring"
		meat.animate "init",
			time: 0.3
			curve: "spring"	

# =============
# Add drag item
cheese = new Layer
	superLayer:itemBg
	image: "images/cheese.png"
cheese.constraints = 
	leading: 240
	height: 48
	width: 48
m.layout.set()
cheese.centerY()
cheeseText = new m.Text
	superLayer:cheese
	text: "3일"
	fontSize:10
	color:"orange"
	constraints:{trailing: -24, width: 20}
m.layout.set()
cheeseText.centerY()
cheeseDrop = new Layer
	borderRadius: 100
	backgroundColor: "orange"
	opacity: 0.50
cheeseDrop.constraints = 
	top: 351
	leading: 293
	width: 48
	height: 48
m.layout.set()
cheese.bringToFront()

cheese.draggable.enabled = true
cheese.draggable.overdrag = false
cheese.draggable.bounce = false
cheese.draggable.momentum = false
cheese.draggable.constraints =
	x: 0
	y: cheese.y
	width: Screen.width
	height: Screen.height - cheese.y
cheeseDrop.scale = 0.25

cheese.states.add
	init:
		scale: 1.0
		x: cheese.x
		y: cheese.y
		animationOptions:
			curve: "spring"
	dragging:
		scale: 1.2
	drop:
		scale: 0.8
		x: cheeseDrop.x
		y: cheeseDrop.y - itemBg.y
		
cheeseDrop.states.add
	init:
		scale: 0.2
	dragging:
		scale: 1.0
	drop:
		scale: 0

cheese.onDrag ->
	#print "x: " + m.dp(cheese.x)
	#print "y: " + m.dp(cheese.y + itemBg.y)
		
cheese.onDragStart ->
	cheeseDrop.animate "dragging",
		time: 0.3
		curve: "spring"
	cheese.animate "dragging",
		time: 0.3
		curve: "spring"

cheese.on Events.DragEnd, (event, draggable, layer) ->
	if Math.abs(cheeseDrop.y - (draggable.y + itemBg.y)) < m.px(30) && Math.abs(cheeseDrop.x - draggable.x) < m.px(30)
		cheeseDrop.animate "drop",
			time: 0.3
			curve: "spring"
		cheese.animate "drop",
			time: 0.3
			curve: "spring"
		audio.play();
	else
		cheeseDrop.animate "init",
			time: 0.3
			curve: "spring"
		cheese.animate "init",
			time: 0.3
			curve: "spring"	
# =============
# Add drag item
carrot = new Layer
	superLayer:itemBg
	image: "images/carrot.png"
carrot.constraints = 
	leading: 312
	height: 48
	width: 56
m.layout.set()
carrot.centerY()
carrotText = new m.Text
	superLayer:carrot
	text: "1일"
	fontSize:10
	color:"orange"
	constraints:{trailing: -24, width: 20}
m.layout.set()
carrotText.centerY()
carrotDrop = new Layer
	borderRadius: 100
	backgroundColor: "orange"
	opacity: 0.50
carrotDrop.constraints = 
	top: 541
	leading: 222
	width: 48
	height: 48
m.layout.set()
carrot.bringToFront()

carrot.draggable.enabled = true
carrot.draggable.overdrag = false
carrot.draggable.bounce = false
carrot.draggable.momentum = false
carrot.draggable.constraints =
	x: 0
	y: carrot.y
	width: Screen.width
	height: Screen.height - carrot.y
carrotDrop.scale = 0.25

carrot.states.add
	init:
		scale: 1.0
		x: carrot.x
		y: carrot.y
		animationOptions:
			curve: "spring"
	dragging:
		scale: 1.2
	drop:
		scale: 0.8
		x: carrotDrop.x
		y: carrotDrop.y - itemBg.y
		
carrotDrop.states.add
	init:
		scale: 0.2
	dragging:
		scale: 1.0
	drop:
		scale: 0

carrot.onDrag ->
	#print "x: " + m.dp(carrot.x)
	#print "y: " + m.dp(carrot.y + itemBg.y)
		
carrot.onDragStart ->
	carrotDrop.animate "dragging",
		time: 0.3
		curve: "spring"
	carrot.animate "dragging",
		time: 0.3
		curve: "spring"

carrot.on Events.DragEnd, (event, draggable, layer) ->
	if Math.abs(carrotDrop.y - (draggable.y + itemBg.y)) < m.px(30) && Math.abs(carrotDrop.x - draggable.x) < m.px(30)
		carrotDrop.animate "drop",
			time: 0.3
			curve: "spring"
		carrot.animate "drop",
			time: 0.3
			curve: "spring"
		audio.play();
	else
		carrotDrop.animate "init",
			time: 0.3
			curve: "spring"
		carrot.animate "init",
			time: 0.3
			curve: "spring"	
