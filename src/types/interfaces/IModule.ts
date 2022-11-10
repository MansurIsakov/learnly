export interface ModuleInput {
  moduleLevel: number;
  module: string[];
  moduleCode: string;
  moduleName: string;
  credits: number;
  type: string;
  teachers: [];
  classes: IClass[];
  courses: string[];
}
export interface IClass {
  time: string;
  day: string;
  venue: string;
  tutor: string;
  type: string;
  group: string[];
}
