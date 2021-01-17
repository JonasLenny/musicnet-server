'use strict'

const EventConstants = {
    // websocket events
    CONNECTION          : 'connection',
    DISCONNECTING       : 'disconnecting',

    // role events
    ROLE_USER           : 'role_user',
    ROLE_DISPLAY        : 'role_display',
    ROLE_CONFIGURATOR   : 'role_configurator',
    ROOM_USER           : 'room_user',
    ROOM_DISPLAY        : 'room_display',

    // api events
    NEW_CONNECTION      : 'new_connection',
    REGISTER            : 'register',
    REGISTER_RESPONSE   : 'register_response',

    // user api events
    SEARCH              : 'search',
    SEARCH_RESPONSE     : 'search_response',
    SEND_TRACK          : 'send_track',
    SEND_TRACK_RESPONSE : 'send_track_response',
}

export default EventConstants
