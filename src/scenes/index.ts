const { Scenes } = require("telegraf");
import addAuthor from "./addAuthor";
import addLanguage from "./addLanguage";
import addUniversity from "./addUniversity";
import admin from "./admin";
import balans from "./balans";
import changeAuthor from "./changeAuthor";
import changeChecked from "./changeChecked";
import changeLanguageReferat from "./changeLanguageByReferat";
import changeThemeReferat from "./changeThemeByReferat";
import control from "./control";
import createWalletRequest from "./createWalletRequest";
import editSlides from "./editSlides";
import feadback from "./feadback";
import indepententWork from "./independentWork";
import sendMesssage from "./message";
import slidesCount from "./slidesCount";
import start from "./start";
import usingFile from "./usingFile";
import usingFileConfirm from "./usingFileConfirm";
import usingFileCount from "./usingFileCount";
import usingFileLanguage from "./usingFileLanguage";
import usingFileName from "./usingFileName";
const stage = new Scenes.Stage([
  start,
  balans,
  control,
  slidesCount,
  editSlides,
  admin,
  sendMesssage,
  changeAuthor,
  addLanguage,
  createWalletRequest,
  changeChecked,
  indepententWork,
  addUniversity,
  addAuthor,
  feadback,
  changeLanguageReferat,
  changeThemeReferat,
  usingFile, // added usingFile scene
  usingFileName, // added usingFileName scene
  usingFileLanguage, // added usingFileLanguage scene
  usingFileCount, // added usingFileCount scene
  usingFileConfirm, // added usingFileConfirm scene
]);

export default stage;
