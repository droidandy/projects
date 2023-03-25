package com.benrevo.common.dto;

public class Contributions {

    private double employer;
    private double employee;
    private double total;

    public Contributions() {
    }

    public Contributions(double employer, double employee, double total) {
        this.employer = employer;
        this.employee = employee;
        this.total = total;
    }

    public void add(Contributions contributions) {
        this.employer += contributions.getEmployer();
        this.employee += contributions.getEmployee();
        this.total += contributions.getTotal();
    }

    public double getEmployer() {
        return employer;
    }

    public void setEmployer(double employer) {
        this.employer = employer;
    }

    public double getEmployee() {
        return employee;
    }

    public void setEmployee(double employee) {
        this.employee = employee;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

}
