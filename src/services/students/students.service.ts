import { students } from "../../data/students.data";
import { Student } from "./interfaces/student.interface";

export class StudentService {
  public getStudentById(dni: string): Student {
    const student = students.find((student: Student) => student.dni === dni);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  }
}