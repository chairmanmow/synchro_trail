
//somewhat faithfully version adapted by "larry lagomorph" from 1977 basic code @ http://deserthat.files.wordpress.com/2010/11/oregon1.doc (you can find traces of the BASIC left in this document)
//contact grudgemirror@gmail.com re:oregontrail with any bug reports (there probably are some i haven't found)
  



var version = "0.1"
console.putmsg("OREGON TRAIL\r\nversion no " + version + "\r\n\r\n");
var yesNo = new String;
var choiceShootingExptLvl = new Number;
var animalsAMT = new Number;
var foodAMT = new Number;
var ammoAMT = new Number;
var clothingAMT = new Number;
var supplyAMT = new Number;
var flagForFortOption = new Number;
var cashInitialPurchase = new Number; 
var totalMileage = new Number;
var turnNumber = new Number;
var woundedFlag = new Number;
var southPassFlag = 0;
var blueMountainPassFlag = 0;
var mileSouthPassFlag = new Number;
var actionChoice = new Number;
var choiceEat = new Number;
var bangResponse = new Number;
var blizzardFlag = new Number;
var notEnoughClothes = new Number;
var fortAMT = new Number;
var eventNo = 0;
var blizzardFlag = 0;
var notEnoughClothes = 0;
var tacticChoice = 0;
var riderHostilityFactor = 0;
var deadFlag = 0;
var illnessFlag = 0;

firstPrompt();  // finds out what your shooting level is 
initialPurchase();
firstTurn();
//log(eventNo.toSource());
function firstPrompt() {
console.putmsg("\1h\1mDO YOU NEED INSTRUCTIONS (\1gYES/\1rNO)");
yesNo = console.getstr();
yesNo = yesNo.toUpperCase();

if(yesNo[0] == "Y") {
instructions();
}
rifleSkills();
}
function instructions() {
console.crlf();
console.crlf();
// ***INSTRUCTIONS***
console.putmsg("\r\n\1hTHIS PROGRAM SIMULATES A TRIP OVER THE OREGON TRAIL FROM");
console.putmsg("\r\n\1hINDEPENDENCE MISSOURI TO OREGON CITY, OREGON IN 1847.");
console.putmsg("\r\n\1hYOUR FAMILY OF FIVE WILL COVER THE 2040 MILE OREGONTRAIL");
console.putmsg("\r\n\1hIN 5-6 MONTHS --- IF YOU MAKE IT ALIVE.");
console.putmsg("\r\n\1hYOU HAD SAVED \1g$900 \1wTO SPEND FOR THE TRIP, AND YOU'VE JUST");
console.putmsg("\r\n\1h   PAID \1r$200 FOR A WAGON.");
console.putmsg("\r\n\1hYOU WILL NEED TO SPEND THE REST OF YOUR MONEY (\1g$700\1w) ON THE");
console.putmsg("\r\n\1h   FOLLOWING ITEMS:");
console.crlf();
 console.putmsg("\r\n\1h     \1gOXEN \1y*** \1wYOU CAN SPEND \1g$200-$300 \1wON YOUR TEAM");
 console.putmsg("\r\n\1h            THE MORE YOU SPEND, THE FASTER YOU'LL GO");
console.putmsg("\r\n\1h               BECAUSE YOU'LL HAVE BETTER ANIMALS");
 console.crlf();
 console.putmsg("\r\n\1h     FOOD\1y *** \1wTHE MORE YOU HAVE, THE LESS CHANCE THERE");
console.putmsg("\r\n\1h               IS OF GETTING SICK");
console.crlf();
console.putmsg("\r\n\1h     \1rAMMUNITION\1y *** \1g$1 \1wBUYS A BELT OF \1r50 BULLETS");
console.putmsg("\r\n\1h            YOU WILL NEED BULLETS FOR ATTACKS BY \1yANIMALS");
console.putmsg("\r\n\1h               AND \1rBANDITS, \1wAND FOR HUNTING \1nFOOD");
 console.crlf();
 console.putmsg("\r\n\1h     \1cCLOTHING\1y *** \1wTHIS IS ESPECIALLY IMPORTANT FOR THE COLD");
 console.putmsg("\r\n\1h               WEATHER YOU WILL ENCOUNTER WHEN CROSSING");
 console.putmsg("\r\n\1h               THE MOUNTAINS");
console.crlf();
console.putmsg("\r\n\1h     \1yMISCELLANEOUS SUPPLIES\1r *** \1wTHIS INCLUDES MEDICINE AND");
console.putmsg("\r\n\1h               OTHER THINGS YOU WILL NEED FOR SICKNESS");
 console.putmsg("\r\n\1h               AND EMERGENCY REPAIRS");
console.crlf();
 console.crlf();
 console.putmsg("\r\n\1hYOU CAN SPEND ALL YOUR \1gMONEY\1w BEFORE YOU START YOUR TRIP -");
console.putmsg("\r\n\1hOR YOU CAN SAVE SOME OF YOUR \1gCASH\1w TO \1mSPEND AT FORTS \1wALONG");
console.putmsg("\r\n\1hTHE WAY WHEN YOU RUN LOW. HOWEVER, ITEMS COST MORE AT");
console.putmsg("\r\n\1hTHE FORTS. YOU CAN ALSO GO \1rHUNTING\1w ALONG THE WAY TO GET");
console.putmsg("\r\n\1hMORE \1nFOOD.");
 console.crlf();
console.putmsg("\r\n\1hWHENEVER YOU HAVE TO USE YOUR TRUSTY RIFLE ALONG THE WAY,");
 console.putmsg("\r\n\1hYOU WILL BE TOLD TO TYPE IN A WORD \1c(\1yONE THAT SOUNDS LIKE A");
console.putmsg("\r\n\1h\1yGUN SHOT\1c)\1w. \1mTHE FASTER YOU TYPE IN \1cTHAT WORD\1m AND HIT THE");
console.putmsg("\r\n\1h\1r\1i**ENTER**\1n\1h\1m KEY, \1yTHE BETTER LUCK YOU'LL HAVE WITH YOUR GUN.");
console.crlf();
 console.putmsg("\r\n\1hAT EACH TURN, \1gALL ITEMS ARE SHOWN IN DOLLAR AMOUNTS");
console.putmsg("\r\n\1h\1rEXCEPT BULLETS");
console.putmsg("\r\n\1hWHEN ASKED TO ENTER MONEY AMOUNTS, \1n\1rDON'T USE A **$**.");
console.crlf();
console.putmsg("\r\n\1h\1g\1iGOOD LUCK!!!\1n");
}
function rifleSkills() {
	console.crlf();
	 console.crlf();
	 console.putmsg("\1h\1mHOW GOOD A SHOT ARE YOU WITH YOUR RIFLE?\r\n");
	 console.putmsg("\1h\1y(1) \1wACE MARKSMAN,  \1y(2) \1wGOOD SHOT,  \1y(3)\1w FAIR TO MIDDLIN'");
	 console.putmsg("\r\n\1h\1y(4) \1wNEED MORE PRACTICE,  \1y(5) \1wSHAKY KNEES");
	 console.crlf();
	 console.putmsg("\r\n\1h\1cENTER ONE OF THE ABOVE,THE BETTER YOU CLAIM YOU ARE, THE\r\n");
	 console.putmsg("\1h\1cFASTER YOU'LL HAVE TO BE WITH YOUR GUN TO BE SUCCESSFUL.");
	  choiceShootingExptLvl = console.getnum();
	  //if(choiceShootingExptLvl != 5) { // unsure about this expression taken from basic
	//choiceShootingExptLvl = 0;
	if(1 > choiceShootingExptLvl || choiceShootingExptLvl > 5) {
	console.putmsg("\r\n\1r\1i[Invalid Selection]");
	rifleSkills();
	}
} 
function getAnimals() {
console.putmsg("\1h\1mHOW MUCH DO YOU WANT TO SPEND ON YOUR OXEN TEAM\r\n \1y minimum : 201 \r\n");
animalsAMT = console.getnum();
while(300 <= animalsAMT || animalsAMT <= 200) 
{
	if(animalsAMT <= 200){
	console.putmsg("NOT ENOUGH");
	}
	if(animalsAMT >= 300) {
	console.putmsg("TOO MUCH");
	}
animalsAMT = console.getnum();
}
}
function getFood() {
	console.putmsg("\1h\1wHOW MUCH DO YOU WANT TO SPEND ON FOOD");
	 foodAMT = console.getnum();
	 while(foodAMT <= 0) { 
	console.putmsg("IMPOSSIBLE");
	 foodAMT = console.getnum();
}
}
function getAmmo() {
	console.putmsg("\1h\1rHOW MUCH DO YOU WANT TO SPEND ON AMMUNITION");
	ammoAMT = console.getnum();
	while(ammoAMT <= 0) {
	console.putmsg("IMPOSSIBLE");
	ammoAMT = console.getnum();
}
}
function getClothing(){
	console.putmsg("\1h\1bHOW MUCH DO YOU WANT TO SPEND ON CLOTHING");
	clothingAMT = console.getnum();
	while(clothingAMT <= 0){
	console.putmsg("IMPOSSIBLE");
	clothingAMT = console.getnum();
}
}
function getSupplies() {
	console.putmsg("\1h\1yHOW MUCH DO YOU WANT TO SPEND ON MISCELLANEOUS SUPPLIES");
	supplyAMT = console.getnum();
	while(supplyAMT <= 0) {
	console.putmsg("IMPOSSIBLE");
	supplyAMT = console.getnum();
}
}
function initialPurchase() {

	flagForFortOption = flagForFortOption*-1;  // WTF IS THIS? -- switch from true to false whether or not you have to go to the fort
	//woundedFlag*illnessFlag*southPassFlag*blueMountainPassFlag*M*mileSouthPassFlag*turnNumber=0;  // WTF IS THISg removed as its probably some legacy basic code for clearing memory in old cpus
	anotherPurchase();

}
function anotherPurchase() {
	console.crlf();
	getAnimals();
	getFood();
	getAmmo();
	getClothing();
	getSupplies(); 
	calculateCosts();
	}
function calculateCosts() {
	cashInitialPurchase = 700 - animalsAMT - foodAMT - ammoAMT - clothingAMT - supplyAMT;
	if(cashInitialPurchase <= 0) {
		console.putmsg("\r\n\1h\1r\1iYOU OVERSPENT! \r\n\1n\1h\1yYOU ONLY HAD $700 TO SPEND. BUY AGAIN");
		initialPurchase();
	}
	else {
	ammoAMT *= 50;
	console.putmsg("\1h\1gAFTER ALL YOUR PURCHASES, YOU NOW HAVE \1r" + cashInitialPurchase + "\1g  DOLLARS LEFT");
	}
}
function inventoryCheck() {
	 if(foodAMT <= 0) { 
		foodAMT=0;
		}
	if(ammoAMT <= 0) {
		ammoAMT=0;
		} 
	//clearIllness();
	if(clothingAMT <= 0) {  // if there is no clothing then there is no clothing
			clothingAMT = 0;} 	
	if(supplyAMT <= 0) {
			supplyAMT=0;
	} 
	if(foodAMT <= 13) {
		console.putmsg("\r\n\1h\1r\1i\1wYOU'D BETTER DO \1rSOME HUNTING OR \1n\1i\1mBUY FOOD \1h\1wAND SOON!!!!\1n\r\n\r\n");
		console.beep();
		console.pause();
	}
	foodAMT = parseInt(foodAMT);
	ammoAMT = parseInt(ammoAMT);
	clothingAMT = parseInt(clothingAMT);
	supplyAMT = parseInt(supplyAMT);
	cashInitialPurchase = parseInt(cashInitialPurchase);
	totalMileage = parseInt(totalMileage);
	prevMileage=totalMileage; // WTF IS THIS} decemberSixth();
	//console.putmsg("end inventory check");
}
function doctorVisit() {
	cashInitialPurchase = cashInitialPurchase - 20;
	if(cashInitialPurchase>0) {
		console.putmsg("\r\n'\1h\1yLet's get you stitched up.\1n\1w'\r\n\1h\1r\1iDOCTOR'S BILL IS $20\1n\r\n");
		clearIllness();
	}
	else {
	cantAffordDoctor();
	}
	}

function turnStart(){
	inventoryCheck();
	//console.putmsg("\r\nTurn \1m" + turnNumber + "\1w Start.\r\n\1gIllness Flag = " + illnessFlag + "\r\n\1rWounded Flag = " + woundedFlag + "\r\n\1bActual Mileage = " + totalMileage + "\r\n\1mSouth Pass Flag normal[mile] = " + southPassFlag + "/" + mileSouthPassFlag + "\r\n");
		if(illnessFlag == 1 || woundedFlag == 1) {  //are you sick?
				doctorVisit();

}
					//console.putmsg("b4 southpass flagcheck");
	southPassFlagCheck();
}
function firstTurn() {
turnNumber = 0;
console.crlf();
console.putmsg("\1h\1mMONDAY \1wMARCH 29 1847");
console.crlf();
turnStart();
}
function turnCheck() {

		 if(totalMileage <= 2040) { 
	 // ***SETTING DATE****
	turnNumber++;  //advances turn
	 console.crlf();
	 console.putmsg("\1h\1mMONDAY ");
	if(turnNumber == 1) {

		 console.putmsg("\1h\1wAPRIL 12");
}
if(turnNumber == 2) {
		 console.putmsg("\1h\1wAPRIL 26 ");
}
if(turnNumber == 3) {
		console.putmsg("\1h\1wMAY 10");
}
if(turnNumber == 4) {
		console.putmsg("\1h\1wMAY 24 ");
		}
if(turnNumber == 5) {
		console.putmsg("\1h\1wJUNE 7 ");
}
if(turnNumber == 6) {
		console.putmsg("\1h\1wJUNE 21 ");
}
if(turnNumber == 7) {
		console.putmsg("\1h\1wJULY 5 ");
}
if(turnNumber == 8) {
		console.putmsg("\1h\1wJULY 19 ");
}
if(turnNumber == 9) {
		console.putmsg("\1h\1wAUGUST 2 ");
}
if(turnNumber == 10) {
		console.putmsg("\1h\1wAUGUST 16 ");
}
if(turnNumber == 11) {
		console.putmsg("\1h\1wAUGUST 31 ");
}
if(turnNumber == 12) {
		console.putmsg("\1h\1wSEPTEMBER 13");
}
if(turnNumber == 13) {
		console.putmsg("\1h\1wSEPTEMBER 27 ");
}
if(turnNumber == 14) {
		 console.putmsg("\1h\1wOCTOBER 11 ");
}
if(turnNumber == 15) {
		 console.putmsg("\1h\1wOCTOBER 25");
}
if(turnNumber == 16) {
	console.putmsg("\1h\1wNOVEMBER 8 ");
}
if(turnNumber == 17) {
		console.putmsg("\1h\1wNOVEMBER 22 ");
	}
if(turnNumber == 18) {
		console.putmsg("\1h\1wDECEMBER 6 ");
}
if(turnNumber == 19) {
		 console.putmsg("\1h\1wDECEMBER 20 ");
		 }
		 if(turnNumber == 20) {
		console.putmsg("\1h\1wYOU HAVE BEEN ON THE TRAIL TOO LONG  ------ \r\n");
		console.putmsg("\1h\1wYOUR FAMILY DIES IN THE FIRST BLIZZARD OF WINTER");
		formalities();
		return; 
		//console.crlf();
		}
		console.putmsg(" 1847\r\n");
		turnStart();
}
else {
finalTurn();
}
}

function cantAffordDoctor() {
 cashInitialPurchase=0
 console.putmsg("YOU CAN'T AFFORD A DOCTOR");
 youDiedOf();
 }				
function clearIllness() {
	woundedFlag = 0;
	illnessFlag = 0;
}
function turnChoice() {
	console.putmsg("\r\n\1h\1w*FOOD*" + "\1h\1rBULLETS " + "\1bCLOTHING" + "\1yMISC. SUPP." + "\1gCASH");
	console.crlf();
	console.putmsg("\1w--" + foodAMT + "\1w--\1r --" + ammoAMT + "--\1b-- " + clothingAMT + "--\1y--" + supplyAMT + " --\1g--" + cashInitialPurchase);
	if(flagForFortOption != -1) {
	flagForFortOption = flagForFortOption * -1; 
	fortHuntContinue();
}
}
function southPassFlagCheck(){
	//console.putmsg("south pass flag check");
	if(mileSouthPassFlag != 1) {
	console.putmsg("\1h\1yTOTAL MILEAGE IS : \1g" + totalMileage + "\r\n");
	turnChoice();
	}
	else
	{
	console.putmsg("\1h\1yTOTAL MILEAGE IS 950\r\n\1n\1yYou are traveling through mountains");
	mileSouthPassFlag = 0;
	turnChoice();
} 
}
function fortHuntContinue(){
	console.putmsg("\r\n\r\n\1h\1wDO YOU WANT TO \1m(1) STOP AT THE NEXT FORT, \1h\1r(2) HUNT, ");
	console.putmsg("OR \1h\1g(3) CONTINUE \1i\1y?\1n");
	actionChoice = console.getnum();
		if(actionChoice == 1) {
				fortBuy();
				}	
		else if(actionChoice == 2) {
			if(ammoAMT<39){
			console.putmsg("\1h\1rTOUGH---YOU NEED MORE BULLETS TO GO HUNTING");
			fortHuntContinue();
			}
			else {
			goHunting();
			}
			}
		else if(actionChoice == 3){
		checkFoodAMT();
		} 
		else
		{
		console.putmsg("\1i\1r[Invalid Selection]\1n");
		fortHuntContinue();
		return;
}
}

function fortBuy(){
console.putmsg("\1h\1gENTER WHAT YOU WISH TO SPEND ON THE FOLLOWING\r\n");

//setFortAmtSubroutine();
foodFortCycle();
ammoFortCycle();
clothingFortCycle();
supplyFortCycle();
totalMileage = totalMileage-45;
checkFoodAMT();
}

function goHunting() {
if(ammoAMT<39) {
	console.putmsg("TOUGH---YOU NEED MORE BULLETS TO GO HUNTING");
	fortHuntContinue();
	} 
	else {
totalMileage=totalMileage-45;
shootingSub();
//console.putmsg("bangResponse time " + bangResponse);
if(bangResponse >= 1) {
var randomMeasure =  1000 * Math.random();
//console.putmsg("\1r" + randomMeasure + " : random \1y" + 5*bangResponse + " adj bang response");
if(randomMeasure > 5*bangResponse) {
console.putmsg("\1h\1y\1iNICE SHOT!!! \1n\1h\1c RIGHT ON TARGET \r\n\1gGOOD EATIN' TONIGHT!!\r\n");
console.putmsg("\1h\1rRIGHT BETWEEN THE EYES \1b---\1i\1mYOU GOT A BIG ONE!!!!");
console.putmsg("\r\n\1yFULL BELLIES TONIGHT!\r\n");
foodAMT=foodAMT+52+Math.random() *6;
ammoAMT=ammoAMT-10-3*bangResponse;
//checkFoodAMT();
}
else {
console.putmsg("\1h\1rYOU MISSED..........\1wAND YOUR DINNER GOT AWAY.....");
ammoAMT=ammoAMT-10-Math.random()*4;
}

}
checkFoodAMT();
}
}
//the following function is my own helper function for returning a random integer for selecting a bang word
function getRandomInt(min,max){
return Math.floor(Math.random() * (max - min +1))+ min;
}
function shootingSub() {
var variationsOfShootingWord = new Array;
variationsOfShootingWord[0]="BANG"
variationsOfShootingWord[1]="BLAM"
 variationsOfShootingWord[2]="POW"
variationsOfShootingWord[3]="WHAM"
var shootingWordSelector=parseInt(getRandomInt(0,3));

console.putmsg("\r\nTYPE \1h\1y" + variationsOfShootingWord[shootingWordSelector]);
console.crlf();
console.beep();
bangClockStart = system.timer;
//console.putmsg("bangClockStart time " + bangClockStart);
userBangWord = console.getstr();
bangResponse = system.timer;
userBangWord = userBangWord.toUpperCase();
//console.putmsg("bangResponse time " + bangResponse);
bangResponseCheck();
function bangResponseCheck() {
 bangResponse=((bangResponse-bangClockStart)*36)-(choiceShootingExptLvl-1)
console.crlf();
/*if(bangResponse<0) {
 bangResponse=0;
} */
if(userBangWord != variationsOfShootingWord[shootingWordSelector]) {
bangResponse = 0;
misfire();
}
}
}
function checkFoodAMT(){
	//console.putmsg("checkFoodAMT function");
	 if(foodAMT <= 13) {
		 starve();
		 return;
		} 
		else
	
	 eatChoice();
	 
	}	
function eatChoice(){
	console.putmsg("\r\nDO YOU WANT TO EAT \1r(1) POORLY  \1y(2) MODERATELY");
	console.putmsg(" OR \1g(3) WELL \1h\1y?");
	choiceEat = console.getnum();
	if(foodAMT-8-5 < 0) {
starve();
}
else if(choiceEat > 3 || choiceEat < 1) {
	console.crlf();
	console.putmsg("YOU CAN'T EAT THAT WELL");
	eatChoice();
	return;
	
}	
else
{
choiceEat = parseInt(choiceEat);  
foodAMT=foodAMT-8-5*choiceEat;
totalMileage = totalMileage+200+(animalsAMT-220)/5+10*Math.random();
blizzardFlag = 0;
notEnoughClothes = 0;
riders();
}
}
function actionEvaluate()  {
	console.putmsg("\r\nDO YOU WANT TO (1) HUNT, OR (2) CONTINUE");
	actionChoice = console.getnum();
		if(actionChoice == 1) {
				goHunting();
		}
		if(actionChoice == 2){
			checkFoodAMT();
			fortBuy();
		} 
}

function riders() {
//console.putmsg("riders function beginning");
if(Math.random() * 10 < ((Math.pow(totalMileage/100-4),27)+72)/(((Math.pow(totalMileage/100-4),2)+12)-1) ){
//console.putmsg("math selected event selector");
eventSelector();
}
else {
console.putmsg("\r\n\1rRIDERS \1yAHEAD.  \1cTHEY ");
riderHostilityFactor = 0;
if(Math.random() <.8) {
console.putmsg("\1gDON'T ");
riderHostilityFactor=1;
}
console.putmsg("\1rLOOK HOSTILE\r\n");

if(Math.random() >.2) {
riderHostilityFactor=1-riderHostilityFactor;
}

tacticChoice = 0;

while(tacticChoice < 1 || tacticChoice > 4) {
console.putmsg("\r\n\1h\1w\1iTACTICS\1n\r\n");
console.putmsg("\1h\1m(1) RUN  \1h\1r(2) ATTACK  \1h\1g(3) CONTINUE  \1y(4) CIRCLE WAGONS\1i?\1n");
tacticChoice = console.getnum();
tacticChoice = parseInt(tacticChoice);
}

if(riderHostilityFactor == 1) {
	milesAfterRiders();
}
else {
	if(tacticChoice == 1) { // 3110
		totalMileage=totalMileage+20;
		supplyAMT=supplyAMT-15;
		ammoAMT=ammoAMT-150;
		animalsAMT=animalsAMT-40;
		riderHostilityCheck();
	}
	if(tacticChoice == 2) { // attackCycle();
		shootingSub();
		//console.putmsg(bangResponse + "\1h\1r : BANG RESPONSE (multiply times 4 subtract 40 ammo amt)");
	
		ammoAMT=ammoAMT-bangResponse*4-40;
		attackRiders();
		
		}
	if(tacticChoice == 3) {
	fortAMT = 0;
	milesAfterRiders();
	}
	if(tacticChoice == 4) {
	if(Math.random() >.8) { 
	ridersNoAttack();
	}
else {
 ammoAMT=ammoAMT-150;
supplyAMT=supplyAMT-15;
 riderHostilityCheck(); }
 
shootingSub();
ammoAMT=ammoAMT-bangResponse*30-80
totalMileage=totalMileage-25
attackRiders();
}
}
}
}
// was miles.Plus.Fifteen
function milesAfterRiders() {
 if(tacticChoice == 1) { //RUN milesMinusFive(); 
totalMileage=totalMileage+15;
 animalsAMT=animalsAMT-10;
riderHostilityCheck();
}
 if(tacticChoice == 2) { //checkMoney();
totalMileage=totalMileage-5;
ammoAMT=ammoAMT-100;
 riderHostilityCheck();
 }
if(tacticChoice == 3) { // milesMinusTwenty();
 riderHostilityCheck();
 } 
if(tacticChoice == 4) {
totalMileage=totalMileage-20;
riderHostilityCheck();
}
}
function ridersNoAttack() {
 console.putmsg("\1h\1wTHEY DID NOT ATTACK");
 eventSelector();
 }
//was friendly.Riders()
function riderHostilityCheck() { 
if(riderHostilityFactor != 0) {
console.putmsg("\r\n\1gRIDERS WERE FRIENDLY, \1h\1y\1iBUT CHECK FOR POSSIBLE LOSSES\1n");
eventSelector();
}
else {
console.putmsg("\r\n\1h\1rRIDERS WERE HOSTILE\r\n\1w--\1y\1iCHECK FOR LOSSES\1n\r\n");
console.beep();
 if(ammoAMT <= 0) {
console.putmsg("\1mYOU RAN OUT OF BULLETS AND GOT MASSACRED BY THE RIDERS");
//nsole.putmsg("\1yammoAMT var : \1h\1r  " + ammoAMT);
formalities();
return;
}
else {
eventSelector();
}
}
}
//southPassFlagCheck();
function attackRiders() {
	//console.putmsg("\r\n\1cYour BANG RESPONSE was " + bangResponse + "\r\n");
	if(bangResponse <= 40 && bangResponse >= 1) {
 	console.putmsg("\1h\1gNICE SHOOTING---YOU DROVE THEM OFF");
	 riderHostilityCheck();
	 }
else { 
	if(bangResponse <= 60 && bangResponse >= 1) {
	console.putmsg("\1h\1yKINDA SLOW WITH YOUR COLT .45");
	riderHostilityCheck();
	}
	else {
	 console.putmsg("\1h\1yLOUSY SHOT---YOU GOT KNIFED\r\n");
	 console.beep();
	woundedFlag = 1;
	console.putmsg("\1cYOU HAVE TO SEE OL' DOC BLANCHARD\r\n");
	riderHostilityCheck();
	}
	}
}	
function showSupplies() {
console.putmsg("\r\n\1h\1w*FOOD*" + "\1h\1rBULLETS " + "\1bCLOTHING" + "\1yMISC. SUPP." + "\1gCASH");
	console.crlf();
	console.putmsg("\1w--" + foodAMT + "\1w--\1r --" + ammoAMT + "--\1b-- " + clothingAMT + "--\1y--" + supplyAMT + " --\1g--" + cashInitialPurchase + "\r\n");
	}
	
function setFortAmtSubroutine() {
	fortAMT = console.getnum();
	if(cashInitialPurchase > 0) {  
	console.putmsg("\1h\1w *** \1g You have $\1y" + cashInitialPurchase + "\1g remaining\r\n");
	//showSupplies();
		fortAMT = console.getnum();
		if(fortAMT > cashInitialPurchase) {
		console.putmsg("\1h\1r\1iYOU DON'T HAVE THAT MUCH\1n\1h\1w--\1yKEEP YOUR SPENDING DOWN\r\n");
		setFortAmtSubroutine();
		}
		else 
		{
		cashInitialPurchase = cashInitialPurchase - fortAMT;	
		//showSupplies();
		}

	 } 
else 
		{
		console.putmsg("\1h\1rYou don't have any money left");
}
}
		
function foodFortCycle(){
	fortAMT = 0;
	console.putmsg("\1h\1wFOOD\r\n");

	if(cashInitialPurchase > 0) {  
	console.putmsg("\1h\1gYou have $\1y" + cashInitialPurchase + "\1g remaining\r\n");
	//showSupplies();
		fortAMT = console.getnum();
		if(fortAMT > cashInitialPurchase) {
		console.putmsg("\1h\1rYOU DON'T HAVE THAT MUCH--KEEP YOUR SPENDING DOWN\r\n");
		foodFortCycle();
		}
		else 
		{
		cashInitialPurchase = cashInitialPurchase - fortAMT;
		foodAMT = parseInt(foodAMT +.667 * fortAMT);
	    fortAMT = 0;
		//showSupplies();
		}
	 } 
	else 
	{
	console.putmsg("\1h\1rYou don't have any money left");
	}
}

function ammoFortCycle(){
	console.putmsg("\1h\1rAMMUNITION");
fortAMT = 0;
		if(cashInitialPurchase > 0) {  
			console.putmsg("\1h\1gYou have $\1y" + cashInitialPurchase + "\1g remaining\r\n");
			//showSupplies();
			fortAMT = console.getnum();
					if(fortAMT > cashInitialPurchase) {
				console.putmsg("\1h\1rYOU DON'T HAVE THAT MUCH--KEEP YOUR SPENDING DOWN\r\n");
				ammoFortCycle();
					}
					else 
					{
				cashInitialPurchase = cashInitialPurchase - fortAMT;
				ammoAMT=parseInt(ammoAMT + 2/3 + fortAMT * 50);
				fortAMT = 0;	//this equation looks shaky
				//showSupplies();
		}
} 
		else 
		{
		console.putmsg("\1h\1rYou don't have any money left");
}
}

function clothingFortCycle(){
	console.putmsg("\1h\1bCLOTHING");
	fortAMT = 0;
		if(cashInitialPurchase > 0) {  
	console.putmsg("\1h\1gYou have $\1y" + cashInitialPurchase + "\1g remaining\r\n");
	//showSupplies();
		fortAMT = console.getnum();
		if(fortAMT > cashInitialPurchase) {
		console.putmsg("\1h\1rYOU DON'T HAVE THAT MUCH--KEEP YOUR SPENDING DOWN\r\n");
		clothingFortCycle();
		}
		else 
		{
		cashInitialPurchase = cashInitialPurchase - fortAMT;
		clothingAMT = parseInt(clothingAMT + 2/3 * fortAMT);
	     fortAMT = 0;
		//showSupplies();
		}

	 } 
else 
		{
		console.putmsg("\1h\1rYou don't have any money left");
}	
}
function supplyFortCycle(){
 console.putmsg("\1h\1yMISCELLANEOUS SUPPLIES");
fortAMT = 0;
	if(cashInitialPurchase > 0) {  
	console.putmsg("\1h\1gYou have $\1y" + cashInitialPurchase + "\1g remaining\r\n");
	//showSupplies();
		fortAMT = console.getnum();
		if(fortAMT > cashInitialPurchase) {
		console.putmsg("\1h\1rYOU DON'T HAVE THAT MUCH--KEEP YOUR SPENDING DOWN\r\n");
		supplyFortCycle();
		}
		else 
		{
		cashInitialPurchase = cashInitialPurchase - fortAMT;
		supplyAMT = parseInt(supplyAMT + (.667 * fortAMT)); 
	    fortAMT = 0;
		//showSupplies();
		}
	 } 
	else 
	{
	console.putmsg("\1h\1rYou don't have any money left");
	}
}

	function shotInLeg() { 
	if(bangResponse <= 35) { 
	quickestDraw();
	}
	else {
	console.putmsg("\r\n\1h\1yYOU GOT \1rSHOT \1yIN THE LEG AND THEY TOOK ONE OF YOUR \1wOXEN");
	woundedFlag = 1;
console.putmsg("\r\nBETTER HAVE A DOC LOOK AT YOUR WOUND");
supplyAMT=supplyAMT-5;
animalsAMT=animalsAMT-20;
	 mountains();
	 }
	 }
function eventSelector() {
//console.putmsg("event slector function beginning");
advanceEventCounter();
console.crlf();

secondSwitch();
//console.putmsg("event switch passed");
}
function advanceEventCounter() {
//console.putmsg("event prior ")
//log(eventNo.toSource());
//console.putmsg(eventNo);
eventNo++;
//log(eventNo.toSource());
//console.putmsg("event advanced "); 
//console.putmsg(eventNo);
}
function secondSwitch() {
console.pause();
console.clear();
//ON eventNo-10 continue: 4220,4290,4340,4650,4610,indianFood();
if(eventNo == 1) {
	console.putmsg("\1n\1h\1r\1yWAGON BREAKS DOWN \1w--\r\n\1iLOSE TIME AND SUPPLIES FIXING IT\1n\r\n");
	totalMileage = totalMileage-15-5*Math.random();
	supplyAMT=supplyAMT-8;
	 mountains();
}
		 
if(eventNo == 2) {
	console.putmsg("\1cOX INJURES LEG\r\n\1y---\r\n\1r\1iSLOWS YOU DOWN REST OF TRIP\1i\r\n");
	totalMileage=totalMileage-25;
	animalsAMT=animalsAMT-20;
	mountains();
}	 
if(eventNo == 3) {
	console.putmsg("\1h\1r\1iBAD LUCK\1b\1n\1h---\1mYOUR DAUGHTER BROKE HER ARM\r\n");
	console.putmsg("\1h\1yYOU HAD TO STOP AND USE SUPPLIES TO MAKE A SLING\r\n");
	totalMileage=totalMileage-5-4*Math.random();
	supplyAMT=supplyAMT-2-3*Math.random();
	mountains();
}	
if(eventNo == 4) {
	console.putmsg("\1bOX WANDERS OFF\--- \1h\1mSPEND TIME LOOKING FOR IT\r\n");
	totalMileage=totalMileage-17;
	mountains();
}
if(eventNo == 5) {
	console.putmsg("\1h\1bYOUR SON GETS LOST\r\n\1y---\r\n\1cSPEND HALF THE DAY LOOKING FOR HIM");
	totalMileage=totalMileage-10
	mountains();
}	 
if(eventNo == 6) {
	console.putmsg("\1yUNSAFE \1bWATER\r\n\1y--\r\n\1rLOSE TIME LOOKING FOR \1cCLEAN SPRING");
	totalMileage=totalMileage-10*Math.random()*-2
	 mountains();
}
	  
if(eventNo == 7) {
	if(totalMileage>950) {
	 coldWeather();
	 }
	 else {
	console.putmsg("\1bHEAVY RAINS---\1rTIME \1wAND \1ySUPPLIES LOST");
	 foodAMT=foodAMT-10;
	ammoAMT=ammoAMT-500;
	supplyAMT=supplyAMT-15;
	totalMileage=totalMileage-10*Math.random()-5;
     mountains();
	}
}
if(eventNo == 8) {
	 console.putmsg("\1h\1rBANDITS ATTACK\1y\1iDraw Your Weapon\1n\r\n");
	 console.beep();
	 console.pause();
	shootingSub();
	ammoAMT=ammoAMT-20*bangResponse;
	//console.putmsg("\r\n\1h\1yBANG RESPONSE = " + bangResponse + "\r\n"); 
	 if(bangResponse <= 50  && bangResponse >= 1) { 
	shotInLeg();
	}
	else {
	console.putmsg("\1rYOU RAN OUT OF BULLETS---THEY GET LOTS OF CASH");
	 cashInitialPurchase=cashInitialPurchase/3;
	shotInLeg();
	}
}
	
if(eventNo == 9) {
	 console.putmsg("\1h\1rTHERE WAS A \1rF\1yI\1rR\1yE \1n\1yIN YOUR WAGON\r\n--\r\n \1h\1wFOOD \1mAND \1ySUPPLIES \1rDAMAGED!\r\n");
	 foodAMT=foodAMT-40;
	 ammoAMT=ammoAMT-400;
	 supplyAMT=supplyAMT-Math.random() *68-3;
	totalMileage=totalMileage-15;
	mountains();
}
if(eventNo == 10) {
	 console.putmsg("\1h\1wLOSE YOUR WAY IN \1nHEAVY FOG\r\n---\1h\1m\1iTIME IS LOST\1n\r\n"); 
	totalMileage=totalMileage-10-5*Math.random();
	 mountains();
}
 
if(eventNo == 11) {
	 console.putmsg("\1h\1gYOU KILLED A POISONOUS SNAKE AFTER IT \1rBIT YOU");
	ammoAMT=ammoAMT-10;
	supplyAMT=supplyAMT-5;
	if(supplyAMT <= 0) {
	console.putmsg("\1r\r\n\1i YOU DIE OF SNAKEBITE SINCE YOU HAVE NO MEDICINE\1n");
	formalities();
	return;
	}
	else {
	 mountains();
	 }
	}
if(eventNo == 12) {
	console.putmsg("YOUR WAGON GETS \1ySWAMPED \1cFORDING \1bRIVER--\11h\1wLOSE FOOD \1wAND \1bCLOTHES");
	foodAMT=foodAMT-30;
	clothingAMT=clothingAMT-20;
	totalMileage=totalMileage-20-20*Math.random();
	mountains();
}	 
if(eventNo == 13) {
	console.putmsg("WILD ANIMALS ATTACK!");
	shootingSub();
	if(ammoAMT>39) { 
	wildBangResponse();
	}
	else {
	console.putmsg("\1h\1rYOU WERE TOO LOW ON BULLETS--");
	 console.putmsg("\1mTHE WOLVES OVERPOWERED YOU");
	 woundedFlag=1;
	youDiedOf();
	}
	 ammoAMT=ammoAMT-20*bangResponse
	clothingAMT=clothingAMT-bangResponse*4
	 foodAMT=foodAMT-bangResponse*8
	mountains();
}	
// this one looks like it needs fixing;	
if(eventNo == 14) {
	if(choiceEat==1) {
	illnessSubroutine();
	} 
	if(choiceEat==2) {
	if(Math.random() <.25) {
		illnessSubroutine();
		}
	
		mountains();
		
		}
	if(choiceEat == 3){
		 if(Math.random() >.5) {
			 illnessSubroutine();
			 mountains();
			 }
			 else {
				mountains();
			
			 }
			 }
}
if(eventNo == 15) {
	console.putmsg("HELPFUL INDIANS SHOW YOU WHERE TO FIND MORE FOOD");
	foodAMT=foodAMT+14;
	mountains();
}

}

// ***MOUNTAINS***
function mountains()  {
	console.pause();
	if(totalMileage <= 950) {
	turnCheck();
	return;
	}
	if(Math.random() * 10< 9-((Math.pow(totalMileage/100-15,2)+72)/(Math.pow(totalMileage/100-15),2)+12)) {
	hailStorm();
	}
console.putmsg("\r\n\1yRUGGED MOUNTAINS\r\n\1h \1y/\1w\n^\1y.\1c~\1y/\1w^\1y.\1c~\1y/\1w^\1y.\1c~\r\n");
console.pause();
if(Math.random() <.1) {

totalMileage=totalMileage-60;
} //4780
if(Math.random() <.11) {
slowGoing();
}
else {
console.putmsg("\1mYOU GOT LOST\r\n\1y---\r\n\1h\1mLOSE VALUABLE TIME TRYING TO FIND TRAIL!");
console.beep();
totalMileage=totalMileage-60;
hailStorm();
console.putmsg("\r\n\1yWAGON \1rDAMAGED!\r\n\1h\1w---\r\n\1yLOSE TIME AND SUPPLIES\r\n");
supplyAMT=supplyAMT-5;
ammoAMT=ammoAMT-200;
totalMileage=totalMileage-20-30*Math.random();
checkSouthPass();
}
}
function checkSouthPass() {
	 if(southPassFlag == 1) { 
	 checkMileage17hundred();
	 }
		 else {
	southPassFlag = 1;
	if(Math.random()<.8) {
	blizzard(); 
	} 
	else {
	console.putmsg("\1h\1cYOU MADE IT SAFELY THROUGH SOUTH PASS--\1rNO SNOW\r\n");
	checkMileage17hundred();
}
}
}
function slowGoing() {
console.putmsg("\1rTHE GOING GETS SLOW\r\n");
 totalMileage= totalMileage-45-Math.random() /.02;
checkSouthPass();
}
//this needs to be fixed big time  ALERT ALERT 
function checkMileage17hundred() { 
if(totalMileage<1700) {
 checkMileageNine50();
 }
if(blueMountainPassFlag != 1) { 
checkMileageNine50();
}
else
{
blueMountainPassFlag = 1;
}
if(Math.random() <.7) {
blizzard();
}
else {
turnCheck();
}
}

function checkMileageNine50() {
if(totalMileage < 950) {
turnCheck();
}
else {
mileSouthPassFlag=1;
turnCheck();
}
}
function blizzard() {
console.putmsg("\1cBLIZZARD IN MOUNTAIN PASS--\1rTIME AND SUPPLIES LOST");
blizzardFlag=1;
foodAMT=foodAMT-25;
supplyAMT=supplyAMT-10;
 ammoAMT=ammoAMT-300;
totalMileage=totalMileage-30-40*Math.random();
if(clothingAMT<18+2*Math.random()) {
illnessSubroutine();
}
else {
checkMileageNine50();
}
}
// ***DYING***
function starve() {
console.putmsg("\r\n\1i\1rYOU RAN OUT OF FOOD AND STARVED TO DEATH\1n");
formalities();
return;
}
function outOfMedicalSupplies() {
console.putmsg("\1rYOU RAN OUT OF MEDICAL SUPPLIES");
youDiedOf();
}
function youDiedOf() {
console.putmsg("\r\n\1rYOU DIED OF ");
if(woundedFlag == 1) {
 injuries();
 }
 else {
console.putmsg("\1cPNEUMONIA");
formalities();
return;
}
}
function injuries() {
console.putmsg("\1h\1rINJURIES");
formalities();
return;
}
function formalities() {
console.crlf();
console.putmsg("DUE TO YOUR UNFORTUNATE SITUATION, THERE ARE A FEW");
console.putmsg(" FORMALITIES WE MUST GO THROUGH");
console.crlf();
console.putmsg("\1cWOULD YOU LIKE A MINISTER?");
yesNo = console.getstr(); 
console.putmsg("\1mWOULD YOU LIKE A FANCY FUNERAL?");
yesNo = console.getstr(); 
console.putmsg("\1bWOULD YOU LIKE US TO INFORM YOUR NEXT OF KIN?");
yesNo = console.getstr(); 
if(yesNo="YES") {
telegraph();
} 
else {
 console.putmsg("\1mBUT YOUR AUNT SADIE IN ST. LOUIS IS REALLY WORRIED ABOUT YOU");
 console.crlf();
telegraph();
}
}
function telegraph() {
console.putmsg("\r\n\1h\1i\1yTHAT WILL BE $4.50 FOR THE TELEGRAPH CHARGE.\1n\r\n");
 console.crlf();
 console.putmsg("\1h\1wWE THANK YOU FOR THIS INFORMATION AND WE ARE SORRY YOU ");
console.putmsg("\1h\1wDIDN'T MAKE IT TO THE GREAT TERRITORY OF OREGON ");
console.putmsg("\1h\1wBETTER LUCK NEXT TIME");
 console.crlf();
console.crlf();
console.putmsg("\1h\1wSINCERELY");
console.crlf();
console.putmsg("\1gTHE OREGONCITY CHAMBER OF COMMERCE\r\n\r\n");
throw "You are dead";
}

// ***FINAL TURN***
function finalTurn() {
 twoWeekFraction=(2040-prevMileage)/(totalMileage-prevMileage);
foodAMT=foodAMT+(1-twoWeekFraction)*(8+5*choiceEat);
console.crlf();
// **BELLS IN LINES 5470,5480**
console.beep();
console.beep();
console.beep();
console.putmsg("YOU FINALLY ARRIVED AT OREGONCITY");
console.putmsg("AFTER 2040 LONG MILES---HOORAY!!!!!");
console.putmsg("A REAL PIONEER!");
 console.crlf();
twoWeekFraction=parseInt(twoWeekFraction*14);
turnNumber=turnNumber*14+twoWeekFraction;
twoWeekFraction=twoWeekFraction+1;

switch(twoWeekFraction%7) { 
//twoWeekFraction=twoWeekFraction-7
// ON twoWeekFraction continue: 5570,5590,5610,5630,5650,5670,5690
 case 1 :
console.putmsg("MONDAY ");
break;
case 2 :
 console.putmsg("TUESDAY ");
break;
case 3 :
console.putmsg("WEDNESDAY ");
break;
case 4 :
 console.putmsg("THURSDAY ");
break;
case 5 :
console.putmsg("FRIDAY ");
break;
case 6 :
console.putmsg("SATURDAY ");
break;
case 0 :
 console.putmsg("SUNDAY ");
break;
}
finalMonth();
console.crlf();
console.putmsg("FOOD","BULLETS","CLOTHING","MISC. SUPP.","CASH");
if(ammoAmt<0) {
 ammoAMT=0;
 }
if(clothingAmount<0) {
clothingAMT=0;
}
if(supplyAMT<0) {
supplyAMT=0;
}
if(cashInitialPurchase<0) {
 cashInitialPurchase=0;
 }
if(foodAMT<0) {
foodAMT=0;
}
console.putmsg(parseInt(foodAMT) + parseInt(ammoAMT) + parseInt(clothingAMT) + parseInt(supplyAMT) + parseInt(cashAfterInitialPurchase));
 console.crlf();
 console.putmsg("PRESIDENT JAMES K. POLK SENDS YOU HIS");
console.putmsg("HEARTIEST CONGRATULATIONS");
 console.crlf();
console.putmsg("AND WISHES YOU A PROSERPOUS LIFE AHEAD");
console.crlf();
console.putmsg("AT YOUR NEW HOME");
}


// ***ILLNESS SUB-ROUTINE***
function illnessSubroutine() {
if(100*Math.random() < 10+(choiceEat-1) * 35) {
console.putmsg("\1gMILD ILLNESS\1y\r\n---\r\n\1cMEDICINE USED\r\n");
totalMileage=totalMileage-5;
 supplyAMT=supplyAMT-2;
}
else { 
if(100*Math.random() <100-(40/Math.pow(4,(choiceEat-1)))) {
console.putmsg("\r\n\1g\1iBAD ILLNESS\1n\1h\1y\r\n---\1gMEDICINE USED");
 totalMileage=totalMileage-5;
supplyAMT=supplyAMT-5;
checkSupplies();
}else {
console.putmsg("\1i\1rSERIOUS \1n\1gILLNESS\r\n\1y---");
console.putmsg("\1h\1wYOU MUST STOP FOR MEDICAL ATTENTION");
supplyAMT=supplyAMT-10;
illnessFlag = 1;
 checkSupplies();
}
}

 if(supplyAMT<0) {
 outOfMedicalSupplies();
 }
 else {
 if(blizzardFlag == 1) {
 checkMileageNine50();
}
else {
mountains();
}
}
}



/* 6470 // ***IDENTIFICATION OF VARIABLES IN THE PROGRAM***
6480 // A = AMOUNT SPENT ON ANIMALS
6490 // B = AMOUNT SPENT ON AMMUNITION
6500 // B1 = ACTUAL RESPONSE TIME FOR console.inkey(TING "BANG"
6510 // B3 = CLOCK TIME START OF console.inkey(TING "BANG"
6520 // C = AMOUNT SPENT ON CLOTHING
6530 // C1 = FLAG FOR INSUFFICIENT CLOTHING IN COLD WEATHER
6540 // C$ = YES/NO RESPONSE TO QUESTIONS
6550 // D1 = COUNTER IN GENERATING EVENTS
6560 // D3 = TURN NUMBER FOR SETTING DATE
6570 // D4 = CURRENT DATE
6580 // D9 = CHOICE OF SHOOTING EXPERTISE LEVEL
6590 // E = CHOICE OF EATING
6600 // F = AMOUNT SPENT ON FOOD
6610 // F1 = FLAG FOR CLEARING SOUTH PASS
6620 // F2 = FLAG FOR CLEARING BLUE MOUNTAINS
6630 // F9 = FRACTION OF 2 WEEKS TRAVELED ON FINAL TURN
6640 // X5 = FLAG FOR INJURY
6650 // L1 = FLAG FOR BLIZZARD
6660 // M = TOTAL MILEAGE WHOLE TRIP
6670 // M1 = AMOUNT SPENT ON MISCELLANEOUS SUPPLIES
6680 // M2 = MILEAGE UP THROUGH PREVIOUS TURN
6690 // M9 = FLAG FOR CLEARING SOUTH PASS IN SETTING MILEAGE
6700 // P = AMOUNT SPENT ON ITEMS AT FORT
6710 // R1 = RANDOM NUMBER IN CHOOSING EVENTS
6720 // S4 = FLAG FOR ILLNESS
6730 // S5 = ""HOSTILITY OF RIDERS"" FACTOR
6740 // S6 = SHOOTING WORD SELECTOR
6750 // S$ = VARIATIONS OF SHOOTING WORD
6760 // T = CASH LEFT OVER AFTER INITIAL PURCHASES
6770 // T1 = CHOICE OF TACTICS WHEN ATTACKED
6780 // X = CHOICE OF ACTION FOR EACH TURN
6790 // X1 = FLAG FOR FORT OPTION
6800 END */

	function hailStorm() { 
	console.putmsg("\r\n\r\n\1h\1w\1iH\1nA\1iI\1nL \1iS\1nT\1iO\1nR\1iM\1n\r\n\1y---\r\n\1hSUPPLIES \1rDAMAGED\r\n");
	console.beep();
	console.pause();
	 totalMileage = totalMileage-5-Math.random() *10;
	ammoAMT=ammoAMT-200;
	supplyAMT=supplyAMT-4-Math.random() * 3;
	// mountains();
	}
	
function warmEnough() {	
		if(notEnoughClothes !=1) {
				 mountains();
			}
			else {
				illnessSubroutine();
				}
}
	
	function coldWeather() {
	 console.putmsg("\1cCOLD \1bWEATHER \1w---\1h\1wBRRRRRRR!---YOU ");
	if(clothingAMT < 22+4*Math.random()) {
	notEnoughClothes = 0;

	}
	else {
	 console.putmsg("\1rDON'T ");
	 notEnoughClothes = 1;
	 
	 }
	 console.putmsg("\1h\1wHAVE ENOUGH CLOTHING TO KEEP WARM\r\n");
	 warmEnough();
	 console.pause();
	 }
	 
function wildBangResponse() {
		if(bangResponse < 45 ||bangResponse == 0){
			 slowDraw();
			 }
			else {
			console.putmsg("NICE SHOOTIN' PARDNER---THEY DIDN'T GET MUCH");
			}
			}

			function slowDraw() {
				console.putmsg("SLOW ON THE DRAW---THEY GOT AT YOUR FOOD AND CLOTHES");
				}
		/*		
						function wildBangResponse {
			 if(bangResponse<2) { slowDraw();
			 }
			 else {
			 console.putmsg("NICE SHOOTIN' PARDNER---THEY DIDN'T GET MUCH");
			}
			function slowDraw(); {
				console.putmsg("SLOW ON THE DRAW---THEY GOT AT YOUR FOOD AND CLOTHES");
				}
		**/		

	 
	function quickestDraw() {
	console.putmsg("QUICKEST DRAW OUTSIDE OF DODGE CITY!!!");
	console.putmsg("YOU GOT 'EM!");
	mountains();
	}
	
function finalMonth() {
if(turnNumber<93) {
console.putmsg("JULY " + turnNumber + " 1847");
turnNumber=turnNumber-93;
}
if(93<turnNumber <124) {
 turnNumber=turnNumber-124;
console.putmsg("AUGUST " + turnNumber + " 1847");
}
if(123<turnNumber<155) {
 turnNumber=turnNumber-155;
 console.putmsg("SEPTEMBER " + turnNumber + " 1847");
}

if(154<turnNumber<185) {
turnNumber=turnNumber-185;
console.putmsg("OCTOBER " + turnNumber + " 1847");
}

 if(184 < turnNumber < 216) {
 turnNumber=turnNumber-216;
 console.putmsg("NOVEMBER " + turnNumber + " 1847");
}
if(215 < turnNumber246) {
turnNumber=turnNumber-246;
 console.putmsg("DECEMBER " + turnNumber + "1847");
 }
 }
 
 function checkSupplies() {
 if(supplyAMT < 0) {
 outOfMedicalSupplies();
 return;
 }
if(blizzardFlag == 1) {
 checkMileageNine50();
 return;;
 }
 mountains();
 }
 
 
 function misfire(){
 var misfirePhrase = new Array;
misfirePhrase[0]="You hit a rock"
misfirePhrase[1]="You completely miss your target, but almost kill your favorite sheep."
 misfirePhrase[2]="Looks like you forgot to take the safety off"
misfirePhrase[3]="Who taught you to shoot? Plaxico Burress?"
var misfirePhraseSelector=parseInt(getRandomInt(0,misfirePhrase.length - 1));
console.putmsg("\1h\1y" + misfirePhrase[misfirePhraseSelector] + "\r\n");
}
 
 
