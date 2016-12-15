var Conf, Model, Tile, View, gameLoop;

Conf = {
  tileSize: 64,
  tilePadding: 10,
  gridSize: 4,
  bgColour: "white",
  tileColour: "#3D3D3D",
  emptyTileColour: "#A9A9A9"
};

Model = {
  tiles: [],
  done: false,
  slide: function(xdir, ydir) {
    var i, len, moved, ref, tile;
    if (!this.done) {
      moved = true;
      while (moved === true) {
        moved = false;
        ref = this.tiles;
        for (i = 0, len = ref.length; i < len; i++) {
          tile = ref[i];
          if (tile) {
            if (tile.slide(xdir, ydir)) {
              moved = true;
            }
          }
          moved;
        }
      }
      return Model.turn();
    }
  },
  tileAtSpot: function(x, y) {
    var i, len, ref, tile;
    ref = this.tiles;
    for (i = 0, len = ref.length; i < len; i++) {
      tile = ref[i];
      if (tile.x === x && tile.y === y) {
        return tile;
      }
    }
    return unedfined;
  },
  spotIsEmpty: function(x, y) {
    var i, len, ref, t;
    ref = this.tiles;
    for (i = 0, len = ref.length; i < len; i++) {
      t = ref[i];
      if (t.x === x && t.y === y) {
        return false;
      }
    }
    return true;
  },
  spotIsInBounds: function(x, y) {
    return x >= 0 && y >= 0 && x < Conf.gridSize && y < Conf.gridSize;
  },
  getSpots: function() {
    var i, j, ref, ref1, spots, x, y;
    spots = [];
    for (x = i = 0, ref = Conf.gridSize; 0 <= ref ? i < ref : i > ref; x = 0 <= ref ? ++i : --i) {
      for (y = j = 0, ref1 = Conf.gridSize; 0 <= ref1 ? j < ref1 : j > ref1; y = 0 <= ref1 ? ++j : --j) {
        spots.push({
          x: x,
          y: y,
          filled: !Model.spotIsEmpty(x, y)
        });
      }
    }
    return spots;
  },
  newTile: function() {
    if (!this.done) {
      return this.tiles.push(new Tile(this.tiles.length));
    }
  },
  lost: function() {
    if (!this.done) {
      console.log("You Lost");
      this.done = true;
      if (gameLost) {
        return gameLost();
      }
    }
  },
  turn: function() {
    this.newTile();
    if (this.tiles.length >= Conf.gridSize * Conf.gridSize) {
      return this.lost();
    }
  }
};

View = {
  ctx: DocGet("main").getContext('2d'),
  clearScreen: function() {
    this.ctx.fillStyle = Conf.bgColour;
    return this.ctx.fillRect(0, 0, DocGet("main").width, DocGet("main").height);
  },
  renderModel: function() {
    var i, j, k, len, ref, ref1, ref2, results, t, ts, x, y;
    this.clearScreen();
    ts = Conf.tileSize;
    for (x = i = 0, ref = Conf.gridSize; 0 <= ref ? i < ref : i > ref; x = 0 <= ref ? ++i : --i) {
      for (y = j = 0, ref1 = Conf.gridSize; 0 <= ref1 ? j < ref1 : j > ref1; y = 0 <= ref1 ? ++j : --j) {
        this.ctx.fillStyle = Conf.emptyTileColour;
        this.ctx.roundRect(x * (Conf.tileSize + Conf.tilePadding), y * (Conf.tileSize + Conf.tilePadding), ts, ts, 10);
      }
    }
    ref2 = Model.tiles;
    results = [];
    for (k = 0, len = ref2.length; k < len; k++) {
      t = ref2[k];
      x = t.getViewX();
      y = t.getViewY();
      this.ctx.fillStyle = Conf.tileColour;
      this.ctx.roundRect(x, y, ts, ts, 10);
      this.ctx.fillStyle = Conf.bgColour;
      this.ctx.font = "40px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      results.push(this.ctx.fillText(t.value, x + (ts / 2), y + (ts / 2)));
    }
    return results;
  }
};

Tile = (function() {
  function Tile(index) {
    var empty_spots;
    this.index = index;
    empty_spots = Model.getSpots();
    empty_spots = empty_spots.filter(function(s) {
      return s.filled === false;
    });
    ShuffleArray(empty_spots);
    this.x = empty_spots[0].x;
    this.y = empty_spots[0].y;
    this.view_x = this.x;
    this.view_y = this.y;
    this.value = [2, 4].rndElement();
  }

  Tile.prototype.getViewX = function() {
    this.view_x = this.view_x + ((this.x - this.view_x) * .3);
    return this.view_x * (Conf.tileSize + Conf.tilePadding);
  };

  Tile.prototype.getViewY = function() {
    this.view_y = this.view_y + ((this.y - this.view_y) * .3);
    return this.view_y * (Conf.tileSize + Conf.tilePadding);
  };

  Tile.prototype.slide = function(xdir, ydir) {
    var has, nx, ny;
    nx = this.x + xdir;
    ny = this.y + ydir;
    has = false;
    if (Model.spotIsInBounds(nx, ny)) {
      if (Model.spotIsEmpty(nx, ny)) {
        this.x = nx;
        this.y = ny;
        has = true;
      } else {
        if (Model.tileAtSpot(nx, ny).value === this.value) {
          if ((!Model.spotIsEmpty(nx + xdir, ny + ydir)) || (!Model.spotIsInBounds(nx + xdir, ny + ydir))) {
            Model.tileAtSpot(nx, ny).value *= 2;
            Model.tiles.splice(this.index, 1);
            has = true;
          }
        }
      }
    }
    return has;
  };

  return Tile;

})();

gameLoop = function() {
  View.renderModel();
  return requestAnimationFrame(gameLoop);
};

gameLoop();

Model.turn();

Model.turn();

document.onkeydown = function(e) {
  var key;
  key = e.keyCode;
  switch (true) {
    case key === 37 || key === 65:

      /*LEFT */
      return Model.slide(-1, 0);
    case key === 38 || key === 87:

      /*UP */
      return Model.slide(0, -1);
    case key === 39 || key === 68:

      /*RIGHT */
      return Model.slide(1, 0);
    case key === 40 || key === 83:

      /*DOWN */
      return Model.slide(0, 1);
  }
};
