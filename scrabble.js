//Philip yeh , gui assignment 5
//this is the JS of my scrabble board.
//I managed to make a board, rack and have moveable tiles.
//These tiles can be dragged onto the board and the game will calculate the score
//You can shuffle your hand, and get a new set of tiles with a button.
//there is also a reset Buttons
//When the tiles run out, the game will disable the buttons and stop.
//What I am missing is a way to get rid of individual tiles with a replacement. I can only get a new set of tiles throught the button

//altered version of values given to us
var ScrabbleTiles = [] ;
ScrabbleTiles["A"] = { "value" : 1,  "original" : 9,  "remaining" : 9  } ;
ScrabbleTiles["B"] = { "value" : 3,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["C"] = { "value" : 3,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["D"] = { "value" : 2,  "original" : 4,  "remaining" : 4  } ;
ScrabbleTiles["E"] = { "value" : 1,  "original" : 12, "remaining" : 12 } ;
ScrabbleTiles["F"] = { "value" : 4,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["G"] = { "value" : 2,  "original" : 3,  "remaining" : 3  } ;
ScrabbleTiles["H"] = { "value" : 4,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["I"] = { "value" : 1,  "original" : 9,  "remaining" : 9  } ;
ScrabbleTiles["J"] = { "value" : 8,  "original" : 1,  "remaining" : 1  } ;
ScrabbleTiles["K"] = { "value" : 5,  "original" : 1,  "remaining" : 1  } ;
ScrabbleTiles["L"] = { "value" : 1,  "original" : 4,  "remaining" : 4  } ;
ScrabbleTiles["M"] = { "value" : 3,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["N"] = { "value" : 1,  "original" : 6,  "remaining" : 6  } ;
ScrabbleTiles["O"] = { "value" : 1,  "original" : 8,  "remaining" : 8  } ;
ScrabbleTiles["P"] = { "value" : 3,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["Q"] = { "value" : 10, "original" : 1,  "remaining" : 1  } ;
ScrabbleTiles["R"] = { "value" : 1,  "original" : 6,  "remaining" : 6  } ;
ScrabbleTiles["S"] = { "value" : 1,  "original" : 4,  "remaining" : 4  } ;
ScrabbleTiles["T"] = { "value" : 1,  "original" : 6,  "remaining" : 6  } ;
ScrabbleTiles["U"] = { "value" : 1,  "original" : 4,  "remaining" : 4  } ;
ScrabbleTiles["V"] = { "value" : 4,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["W"] = { "value" : 4,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["X"] = { "value" : 8,  "original" : 1,  "remaining" : 1  } ;
ScrabbleTiles["Y"] = { "value" : 4,  "original" : 2,  "remaining" : 2  } ;
ScrabbleTiles["Z"] = { "value" : 10, "original" : 1,  "remaining" : 1  } ;
ScrabbleTiles["["] = { "value" : 0,  "original" : 2,  "remaining" : 2  } ;


//https://www.geeksforgeeks.org/javascript-object-keys-function/
var tileSet= [];//array for determining if there is a tile on the square
var playerRack = [];//holds players tiles
var score = 0;
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
var ScrabbleValues = Object.keys( ScrabbleTiles ).length;//in order to work with this data structure i utilized the object.keys function
//this allowed me to find the length of just the vales of each tile

//first function is to get a random tile, set the rack, and fill the rack up with the tiles
function buildRack(){

    var tileCount = 1;//corresponds with the id's so we know which position is what. 1 is starting position


    //broke the link down into multiple variables
    var src;
    var id;
    var title;
    var tileClass = "scrabbleTile";

    //set the rack as empty
    tileSet = [false, false, false, false, false, false, false, false];

    $('#rack div').empty();

    //starting with the first tile in the first postion
    for( var i = 0; tileCount <= 7; i++){

        var randTile = Math.floor((Math.random() * 27));//get a random tile

        //this condition checks if the number of remaining tiles is not empty and if there are tiles left in the bag
        //if there are not empty and their is tiles remaining, add the corresponding random tile, decrement the remaining ScrabbleValue
        //then add the image corresponding with the random tile
        if( ScrabbleTiles[ String.fromCharCode(65 + randTile) ][ "remaining"] !== 0 && tilesLeft()){//utilized .fromcharcode to access the value and increase based of of random number.
        //started at 65 because it goes by ascii table values https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode

            playerRack[tileCount] = {"letter" : String.fromCharCode(65 + randTile),"value" : ScrabbleTiles[ String.fromCharCode(65 + randTile) ][ "value" ]};

            ScrabbleTiles[ String.fromCharCode(65 + randTile) ][ "remaining"]--;//decrement


            //variables that hold the various part of the image link
            id = "tile" + tileCount;//tile position
            title = playerRack[tileCount][ "letter" ];//letter of tile
            src = "./img/Scrabble_Tile_" + playerRack[tileCount][ "letter" ] + ".jpg";//src link

            $('#playerRack').prepend($('<img>',{
              id:id,
              src:src,
              class:tileClass,
              title:title
            }));//add it to the rack with appropriate values


            tileCount++;//increase how many tiles on rack
        }

        //if there are no tiles left disable the button and make a message
        if(tilesLeft() == false ){

            //disable new tiles button upon no tiles left
            $('#Buttons').append("<p id='noTileLeft'>No more tiles</p>");
            $("#newTilesButton").prop("disabled",true);
            return;
        }

        //make the board snappable
        $("#" + id).draggable({
          snap: ".boardTile",
          snapMode: "inner"});
    }

    update();
}




//functions to add drag and drop functionality, and calculating the right score. Basically it uses the idea of matching classes and ids when the tile is hovered over.
function tileOnBoard(event, ui){

  //if the tile matches with a tile of a certain attr, do the math
  // https://stackoverflow.com/questions/2633021/get-attribute-of-jquery-ui-draggable ui.draggle properties information
    if($(this).attr("title") === 'double' && tileSet[$(this).attr("id") ] == false ){
        score += (2 * ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ]  );
    }

    else if($(this).attr("title") === 'triple' && tileSet[$(this).attr("id") ] == false ){
        score += (3 * ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ]  );
    }

    else if($(this).attr("title") === 'blank' && tileSet[$(this).attr("id") ] == false){
        score += (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ] );
    }

    tileSet[$(this).attr("id")  ] = true;

    update();


}

//same thing here, except we subtract the value when the tile is removed,
function tileOffBoard(event, ui){

    if($(this).attr("title") === 'double' && tileSet[$(this).attr("id") ] == true){
        score -= (2 * ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ] );
    }
    else if($(this).attr("title") === 'triple' && tileSet[$(this).attr("id") ] == true){
        score -= (3 * ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ] );
    }
    else if($(this).attr("title") === 'blank' && tileSet[$(this).attr("id") ] == true ){
        score -= (ScrabbleTiles[ String.fromCharCode(ui.draggable.attr("title").charCodeAt(0)) ][ "value" ] );
    }

    tileSet[$(this).attr("id")  ] = false;

    update();

}


function reset(){

    $("#newTilesButton").prop("disabled",false);
    $('#noTileLeft').remove();

    for ( k = 0 ; k < ScrabbleValues ; k++ ) {
        ScrabbleTiles[ String.fromCharCode(65 + k) ][ "remaining"] = ScrabbleTiles[ String.fromCharCode(65 + k) ][ "original" ];
    }

    score = 0;
    update();
    buildRack();
}





//Update is called everytime we have to change the score and change the tiles being used
function update(){

    var curTile;

    $('#scoreSpan').text(score);//change score

    //loop through th values of the table to each one
    for ( j = 0 ; j < ScrabbleValues ; j++ ) {

        curTile = String.fromCharCode(65 + j);

        if( curTile == "["){// have to change name of the [ tile so we can use it with jquery
            curTile = "Blank";
        }

        //update the remaining tiles in table
        $("#" + curTile).text(ScrabbleTiles[ String.fromCharCode(65 + j)]["remaining"]);

    }

}

function tilesLeft(){

    var tileSet = false;//is there a set tile
    var count = 0;

    while( count < 27 ){


        if(ScrabbleTiles[ String.fromCharCode(65 + count) ][ "remaining" ] !== 0){
            tileSet = true;//if the tiles remaining is not 0, there are tiles left
        }
        count++;//loop through all valuees
    }

    return tileSet;//return to be used in conditional statements

}


$(document).ready(function(){

    buildRack();
    $(".boardTile").droppable({ drop: tileOnBoard, out: tileOffBoard });

});
