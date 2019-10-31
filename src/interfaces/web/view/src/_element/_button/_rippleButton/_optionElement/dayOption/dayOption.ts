import OptionElement from './../optionElement';
import { DataBase } from 'front-db';
import { Period } from '../../../../../lib/weekData/weekData';
import lang, {fc} from "./../../../../../lib/language/language";
import { dateToH_MinFormat } from '../../../../_window/subjectOverviewWindow/subjectOverviewWindow';

export default class DayOption extends OptionElement {
  constructor(period: DataBase<Period>, activationCallback?: Function) {
    super(undefined, activationCallback);

    period.get(["begin", "end"], (begin, end) => {
      this.text = dateToH_MinFormat(new Date(begin)) + " - " + dateToH_MinFormat(new Date(end))
    });
  }
  stl() {
    return super.stl() +  require('./dayOption.css').toString();
  }
  public dark(): string {
    return super.dark() + require('./dayOption.dark.css').toString();
  }
  public light(): string {
    return super.light() + require('./dayOption.light.css').toString();
  }
}
window.customElements.define('c-day-option', DayOption);

