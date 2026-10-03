package com.property.app.userpayment.dto;

import com.property.app.userpayment.model.User;

public class UserUpdateRequest {
    private String name;
    private String phone;
    private String address;
    private User.Role role;
    private User.Status status;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }

    public User.Status getStatus() { return status; }
    public void setStatus(User.Status status) { this.status = status; }
}
