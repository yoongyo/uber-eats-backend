import { Inject, Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { EmailVars, MailModuleOptions } from './mail.interfaces';
import got from "got";

@Injectable()
export class MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
    ) {
        this.sendEmail("testing","test", [{key: 'code', value: "code"},{key: 'username', value: "email"}])
    }

    async sendEmail(sebject:string, template:string, emailVars: EmailVars[]) {
        const form = new FormData();
        form.append('from', `Nico from Number Eats <mailgun@${this.options.domain}>`);
        form.append('to', `bizchoollab@naver.com`);
        form.append('subject', sebject)
        form.append("template", template)
        form.append("v:code", "verify-edsfsmail")
        form.append("v:username", "dfs-email")
        emailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
        try{
            const response = await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
                },
                body: form,
            })
            console.log(response.body)
        } catch(e) {
            console.log(e);
        }
    }

    sendVerificationEmail(email: string, code:string) {
        this.sendEmail("Verify your Email", "verify-email", [
            {key: 'code', value: code},
            {key: 'username', value: email}
        ])
    }
}
