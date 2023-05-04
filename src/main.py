#!/usr/bin/env python
#
# Copyright (c) 2012 OpenDNS, Inc.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#    * Redistributions of source code must retain the above copyright
#      notice, this list of conditions and the following disclaimer.
#    * Redistributions in binary form must reproduce the above copyright
#      notice, this list of conditions and the following disclaimer in the
#      documentation and/or other materials provided with the distribution.
#    * Neither the name of the OpenDNS nor the names of its contributors may be
#      used to endorse or promote products derived from this software without
#      specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL OPENDNS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
# OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
# LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
# NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
# EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

""" Class to implement draft-ietf-dnsop-edns-client-subnet (previously known as
draft-vandergaast-edns-client-subnet.

The contained class supports both IPv4 and IPv6 addresses.
Requirements:
  dnspython (http://www.dnspython.org/)
"""
from __future__ import division, print_function

import json
import socket
import struct
from ipaddress import IPv4Address, ip_address

import dns
import dns.edns
import dns.flags
import dns.message
import dns.query
import dns.resolver


def calculateMask(IP: str) -> int:
    try:
        if type(ip_address(IP)) is IPv4Address:
            return 24
        else:
            return 56
    except ValueError:
        return -1


ASSIGNED_OPTION_CODE = 0x0008
DRAFT_OPTION_CODE = 0x50FA

FAMILY_IPV4 = 1
FAMILY_IPV6 = 2
SUPPORTED_FAMILIES = (FAMILY_IPV4, FAMILY_IPV6)
GOOGLE_DNS = '8.8.8.8'


def getDnsResult(resolverIP, recordName, recordType, clientIP, mask):
    addr = socket.gethostbyname(resolverIP)
    # mask = 24
    option_code = ASSIGNED_OPTION_CODE
    print("Testing for edns-clientsubnet using option code", hex(option_code))
    # cso = ClientSubnetOption(clientIP, mask, option_code)
    # print("+++++++++++++++++++++++cso:")
    # print(cso)
    message = dns.message.make_query(recordName, recordType, options=[
                                     dns.edns.ECSOption(clientIP, mask)])
    # options=[dns.edns.ECSOption(clientIP, 24)]
    # message.use_edns(options=options)
    # message.use_edns(options=[cso])
    # message.flags = message.flags | dns.flags.RD

    print("+++++++++++++++++++++++message:")
    print(message)
    print("***********************addr")
    print(addr)

    r = dns.query.udp(message, addr, timeout=10)

    print("=======================query result")
    print(r)

    error = False
    found = False
    recordData = ""
    for options in r.options:
        print("=======================options")
        print(options)

        for rdata in r.answer:
            recordData = rdata

    return recordData


def lambda_handler(event, context):
    print(json.dumps(event))
    body = json.loads(event['body'])
    recordName = body['recordName']
    recordType = body['recordType']
    clientIP = event['headers']['x-forwarded-for']

    mask = calculateMask(clientIP)

    print(mask)

    if recordType == 'CNAME':
        cnameData = getDnsResult(
            GOOGLE_DNS, recordName, recordType, clientIP, mask)
        print(cnameData)
        recordData = getDnsResult(
            GOOGLE_DNS, cnameData[0].to_text(), 'A', clientIP, mask)
    else:
        recordData = getDnsResult(
            GOOGLE_DNS, recordName, recordType, clientIP, mask)

    return {
        "statusCode": 200,
        "statusDescription": "200 OK",
        "isBase64Encoded": False,
        "headers": {
            "Content-Type": "text/html"
        },
        "body": json.dumps(recordData.to_text())
    }
