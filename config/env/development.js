//easy to edit file that describes server info

//port server uses

var port =  process.env.NODE_ENV || 80;


//array that is exposed externally
//port and db used
module.exports = {
    port: port,
    db: 'mongodb://localhost/word_choice'
};

