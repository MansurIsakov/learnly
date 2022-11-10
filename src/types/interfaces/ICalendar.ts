import { IClass } from "./IModule";

export interface CalendarInput {
  monday: IClass[];
  tuesday: IClass[];
  wednesday: IClass[];
  thursday: IClass[];
  friday: IClass[];
  saturday: IClass[];
  sunday: null;
  owner?: string;
}
