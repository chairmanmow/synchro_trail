synchro_trail
=============

This is a javascript version of the Oregon Trail designed to run on telnet bulletin board systems, specifically synchronet, although it should be easy enough to adapt for any platform including other BBS software, node or the web as it doesn't rely to heavily on many platform specific methods, although some of the escape codes for colors might need to be changed (\1's etc)

The version here is not the one some people seem to expect, it's an adaptation from code I'll include found in David Ahl’s Creative Computing May-June 1978 issue making this version an adaptation most people are likely less familiar with at least those who I've talked.

I didn't really play the game that much in the 80's either, so this was a learning exercise for me in some ways, especially as far as getting a handle on being able to reverse engineer logic and translate it to a more modern lexicon.  That being said, if it looks coded weird, it's because I cobbled away at the BASIC code not really knowing how the game was supposed to go and I tried to replicate the logic from within that BASIC paradigm, which after having done it and played through the game, is not the way I would have written it if I had started from scratch.  

I've made some adaptations, and improvements.  The first thing I did was add a little bit of color, and formatting, no big deal.  I also changed the shooting function just a tad to give you some more feedback if you mistype a word for instance as oppose to just telling you that you missed.  These were all implemented in version 0.1

In version 0.2 I've added some improvements that I hope will improve the quality of the game significantly.  
   - bug fixes : the game exits gracefully and doesn't throw any errors on exit (that was a stopgap solution)
   - features : BBS to BBS play, list of players to complete trail, 'tombstones', cause of death variable added
            • implemented a JSON client and DB to record player deaths and those who complete trail.  When you enter the game you will see a list of all the people who have beat the trail and what BBS  (it's not easy), followed by a list of those who have died and how far they made it before they died and it tells you what they died of and what they wrote on their tombstone.  When you die, you will be shown your tombstone and then a flashing red GAME OVER.  If you somehow make it to Oregon City (I've only done it once), you'll get your name on the list of people who have made it, which will be ranked by the date people made it.  I will host a score server on my BBS, telnet://futureland.grudgemirror.com, by default, which I hope people will use to connect to for aggregation of score data.
