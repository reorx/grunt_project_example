#!/usr/bin/env python
# -*- coding: utf-8 -*-

from torext.app import TorextApp
import settings


app = TorextApp(settings)


from torext.handlers import BaseHandler


@app.route('/')
class HomeHandler(BaseHandler):
    def get(self):
        self.render('index.html')


@app.route('/iamapp')
class IamappHandler(BaseHandler):
    def get(self):
        self.render('iamapp/index.html')


if '__main__' == __name__:
    app.command_line_config()
    app.run()
