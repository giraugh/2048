######OBJECT-DEFS########

Conf =
  tileSize: 64
  tilePadding: 10
  gridSize: 4
  bgColour: "white"
  tileColour: "#3D3D3D"
  emptyTileColour: "#A9A9A9"

Model =
  tiles: []
  done: false
  slide: (xdir, ydir)->
    if not @done
      #Move the pieces
      moved = true
      while moved is true
        moved = false
        for tile in @tiles
          if tile
            if tile.slide xdir, ydir
              moved = true
          moved

      #Make new ones
      Model.turn()
  tileAtSpot: (x, y)->
    for tile in @tiles
      if tile.x is x and tile.y is y
        return tile
    return unedfined
  spotIsEmpty: (x, y)->
    for t in @tiles
      if t.x is x and t.y is y
        return false
    return true
  spotIsInBounds: (x, y)->
    x >= 0 and y >= 0 and
    x < Conf.gridSize and
    y < Conf.gridSize
  getSpots: ->
    spots = []
    for x in [0...Conf.gridSize]
      for y in [0...Conf.gridSize]
        spots.push
          x: x
          y: y
          filled: not Model.spotIsEmpty x, y
    return spots
  newTile: ->
    if not @done
      @tiles.push new Tile @tiles.length
  lost: ->
    unless @done
      console.log "You Lost"
      @done = true

      #Do event in parent
      if gameLost
        gameLost()
  turn: ->
    @newTile()
    if @tiles.length >= Conf.gridSize * Conf.gridSize
      @lost()

View =
  ctx: DocGet("main").getContext '2d'
  clearScreen: ()->
    @ctx.fillStyle = Conf.bgColour
    @ctx.fillRect 0, 0, DocGet("main").width, DocGet("main").height
  renderModel: ()->
    #Clear Screen
    @clearScreen()

    #Nice shorthand
    ts = Conf.tileSize

    #Draw Empty Tiles
    for x in [0...Conf.gridSize]
      for y in [0...Conf.gridSize]
        @ctx.fillStyle = Conf.emptyTileColour
        @ctx.roundRect x * (Conf.tileSize + Conf.tilePadding),
                       y * (Conf.tileSize + Conf.tilePadding),
                       ts, ts, 10

    #Draw Tiles
    for t in Model.tiles
      x = t.getViewX()
      y = t.getViewY()

      #Rounded Rect
      @ctx.fillStyle = Conf.tileColour
      @ctx.roundRect x, y, ts, ts, 10

      #Value Print
      @ctx.fillStyle = Conf.bgColour
      @ctx.font = "40px sans-serif"
      @ctx.textAlign = "center"
      @ctx.textBaseline = "middle"
      @ctx.fillText t.value, x + (ts/2), y + (ts/2)

########CLASSES##########

class Tile
  constructor: (index) ->
    #Record my array index
    @index = index

    #Get Spots
    empty_spots = Model.getSpots()

    #Filter out filled ones
    empty_spots = empty_spots.filter (s)->s.filled is false

    #Shuffle them
    ShuffleArray empty_spots

    #Take position of one of them
    @x = empty_spots[0].x
    @y = empty_spots[0].y

    #Where its actually drawn
    @view_x = @x
    @view_y = @y

    #Random value of 2 or 4
    @value = [2, 4].rndElement()
  getViewX: ->
    #Move view x towards x by 20%
    @view_x = @view_x + ((@x - @view_x) * .3)
    @view_x * (Conf.tileSize + Conf.tilePadding)
  getViewY: ->
    @view_y = @view_y + ((@y - @view_y) * .3)
    @view_y * (Conf.tileSize + Conf.tilePadding)
  slide: (xdir, ydir)->
    nx =  @x+xdir
    ny =  @y+ydir
    has = false
    if Model.spotIsInBounds nx, ny
      #Move uninteruppted
      if Model.spotIsEmpty nx, ny
        @x = nx
        @y = ny
        has = true
      else
        #Would i move into a same value spot?
        if Model.tileAtSpot(nx, ny).value is @value
          #Can that spot not move?
          if (not Model.spotIsEmpty nx+xdir, ny+ydir) or (not Model.spotIsInBounds nx+xdir, ny+ydir)
            #Double Their Value
            Model.tileAtSpot(nx, ny).value *= 2

            #Remove me from tiles
            Model.tiles.splice @index, 1

            has = true
    return has

##########START##########

#Game Loop
gameLoop = ->
  View.renderModel()
  requestAnimationFrame gameLoop

#Start Loop
gameLoop()

#Start with two tiles
Model.turn()
Model.turn()

##########EVENTS##########

document.onkeydown = (e)->
  key = e.keyCode

  switch true
    when key is 37 or key is 65
      ###LEFT###
      Model.slide -1, 0
    when key is 38 or key is 87
      ###UP###
      Model.slide 0, -1
    when key is 39 or key is 68
      ###RIGHT###
      Model.slide 1, 0
    when key is 40 or key is 83
      ###DOWN###
      Model.slide 0, 1
