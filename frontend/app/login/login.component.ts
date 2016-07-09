///<reference path="../../browser.d.ts"/>

import {Component, OnInit} from "@angular/core";
import {LoginCredential} from "../../../common/entities/LoginCredential";
import {AuthenticationService} from "../model/network/authentication.service.ts";
import {Router} from "@angular/router-deprecated";
import {FORM_DIRECTIVES} from "@angular/common";
import {Message} from "../../../common/entities/Message";
import {User} from "../../../common/entities/User";
import {ErrorCodes} from "../../../common/entities/Error";

@Component({
    selector: 'login',
    templateUrl: 'app/login/login.component.html',
    styleUrls: ['app/login/login.component.css'],
    directives: [FORM_DIRECTIVES]
})
export class LoginComponent implements OnInit {
    loginCredential:LoginCredential;
    loginError = null;

    constructor(private _authService:AuthenticationService, private _router:Router) {
        this.loginCredential = new LoginCredential();
    }

    ngOnInit() {
        if (this._authService.isAuthenticated()) {
            this._router.navigate(['Gallery', {directory: "/"}]);
        }
    }

    onLogin() {
        this.loginError = null;
        this._authService.login(this.loginCredential).then((message:Message<User>) => {
            if (message.error) {
                if (message.error.code === ErrorCodes.CREDENTIAL_NOT_FOUND) {
                    this.loginError = "Wrong username or password";
                }
            }
        });
    }
}

