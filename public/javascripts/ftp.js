
/*ProFTPd Manager*/

'use strict';

(function (global) {

  var $ = global.jQuery;
  var id_user;
  var id_group;

  $(document).ready(function () {

    //Chargement des listes des utilisateurs et des groupes
    getUserList();
    getGroupList();

    //Gestion des champs vides
    //GROUP
    $('#GroupName').focus(function () {
      $('#GroupName').removeClass('errorBorder');
      $('#ErrorGroup').hide('fast');
      $('.errorContent').html('');
    });
    $('#GroupId').focus(function () {
      $('#GroupId').removeClass('errorBorder');
      $('#ErrorGroup').hide('fast');
      $('.errorContent').html('');
    });

    //USER
    [
      '#UserName',
      '#PwdUser',
      '#HomeDir',
      '#Shell',
      '#UserId'
    ].forEach(function (id) {
      id = $(id);
      id.focus(function (e) {
        $(e.currentTarget).removeClass('errorBorder');
        $('#ErrorUser').hide('fast');
        $('.errorContent').html('');
      });
    });

    // Enter key press in formula
    [
      '#GroupName',
      '#GroupId',
      '#GroupMember'
    ].forEach(function (id) {
      id = $(id);
      id.keydown(function(event) {
        if(event.keyCode==13){
           $('#group').trigger('click');
        }
      });
    });

    [
      '#UserName',
      '#PwdUser',
      '#UserId',
      '#HomeDir'
    ].forEach(function (id) {
      id = $(id);
      id.keydown(function(event) {
        if(event.keyCode==13){
           $('#user').trigger('click');
        }
      });
    });

    $('#ModalGroup').focusout(function () {
      $('#ErrorGroup').hide('fast');
      $('.errorContent').html('');
      $('#GroupName').removeClass('errorBorder');
      $('#GroupId').removeClass('errorBorder');
    });

    $('#ModalUser').focusout(function () {
      $('#ErrorUser').hide('fast');
      $('.errorContent').html('');
      $('#UserName').removeClass('errorBorder');
      $('#PwdUser').removeClass('errorBorder');
      $('#UserId').removeClass('errorBorder');
      $('#HomeDir').removeClass('errorBorder');
      $('#Shell').removeClass('errorBorder');
    });

    //Switch modal
    $('#ModalGroup').on('hidden.bs.modal', function (e) {
      //groupSwitch();
      resetGroupModal();
    });
    $('#ModalUser').on('hidden.bs.modal', function (e) {
      //userSwitch();
      resetUserModal();
    });

    //Récupération des listes
    $('#userList').click(function () {
      getUserList();
    });
    $('#grpList').click(function () {
      getGroupList();
    });

    // Ajout
    $('#group').click(function () {
      var mode = $('#group').attr('data-addmode');

      if (mode === 'true') {
        $('#ErrorGroup').hide('fast');
        $('.errorContent').html('');
        addGroup();
      } else {
        $('#ErrorGroup').hide('fast');
        $('.errorContent').html('');
        editGroup(id_group);
      }
    });
    $('#user').click(function () {
      var mode = $('#user').attr('data-addmode');

      if (mode === 'true') {
        $('#ErrorUser').hide('fast');
        $('.errorContent').html('');
        addUser();
      } else {
        $('#ErrorUser').hide('fast');
        $('.errorContent').html('');
        editUser(id_user);
      }
    });

  });

  /************   Fonctions   ***********/
  //Reset du modal
  function resetGroupModal() {
    $('#LabelGroup').html('Ajouter un groupe');
    $('#group').html('Ajouter');
    $('#group').attr('data-addmode', 'true');
    $('#GroupId').prop('disabled', false);
    $('#GroupName').val('');
    $('#GroupId').val('');
    $('#GroupMember').val('');
  }
  function resetUserModal() {
    $('#LabelUser').html('Ajouter un utilisateur');
    $('#user').html('Ajouter');
    $('#user').attr('data-addmode', 'true');
    $('#UserName').val('');
    $('#PwdUser').val('');
    $('#UserId').val('0');
    $('#HomeDir').val('');
    $('#Shell').val('/bin/false');
  }

  //Permet de binder les éléments au DOM après mes requêtes ajax
  function initUserBinding() {

    $('.delUsr').on('click', function () {
      var id = $(this).attr('data-usr');
      var answer = confirm('Etes-vous sûr de supprimer cet utilisateur?');
      if (answer) {
        delUser(id);
      }
    });

    $('.editUser').on('click', function () {
      id_user = $(this).attr('data-iduser');
      $('#LabelUser').html('Editer un utilisateur');
      $('#user').html('Appliquer');
      $('#user').attr('data-addmode', 'false');
      $('#UserName').val($(this).attr('data-username'));
      $('#UserId').val($(this).attr('data-uid'));
      $('#UserGrp').val($(this).attr('data-gid'));
      $('#HomeDir').val($(this).attr('data-homedir'));
      $('#Shell').val($(this).attr('data-shell'));
      $('#ModalUser').modal('show');
    });

    // Gestion de l'accessibilité
    $('.accessBox').change(function () {
      var acc = $(this).attr('data-access');
      if($(this).is(":checked")) {
        //console.log('ACCESS: ', acc);
        getAccess(acc, true);
      } else {
        //console.log('PAS ACCESS: ', acc);
        getAccess(acc, false);
      }
    });
  }
  function initGroupBinding() {
    $('.delGrp').on('click', function () {
      var id = $(this).attr('data-id');
      var answer = confirm('Etes-vous sûr de supprimer ce groupe?');
      if (answer) {
        delGroup(id);
      }
    });

    $('.editGroup').on('click', function () {
      id_group = $(this).attr('data-gid');
      $('#LabelGroup').html('Editer un groupe');
      $('#group').html('Appliquer');
      $('#group').attr('data-addmode', 'false');
      $('#GroupName').val($(this).attr('data-grpname'));
      $('#GroupId').val($(this).attr('data-gid'));
      $('#GroupId').prop('disabled', true);
      $('#GroupMember').val($(this).attr('data-members'));
      $('#ModalGroup').modal('show');
    });
  }

  /**********   Listage   ************/

  function getUserList() {
    $('#listUser').html('');
    var num = 1;
    var i = 0;

    var xhr = $.ajax({
      url: '/users',
      timeout: 5000,
      dataType: 'json',
      success: function (data) {
        var access_list = new Array();
        for (var key in data) {
          if (data[key]['passwd'] === undefined){
            if (data[key]['LoginAllowed'] === 'true') {
              $('#listUser').append('<tr><td>' + num + '</td><td>' + data[key]['userid'] + '</td><td>Oui</td><td>' + data[key]['uid'] + '</td><td>' + data[key]['gid'] + '</td><td>' + data[key]['homedir'] + '</td><td>' + data[key]['shell'] + '</td><td><input class="accessBox" data-access="' + data[key]['id'] + '" type="checkbox" checked=true></td><td><button data-iduser="' + data[key]['id'] + '" data-username="' + data[key]['userid'] + '" data-uid="' + data[key]['uid'] + '" data-gid="' + data[key]['gid'] + '" data-homedir="' + data[key]['homedir'] + '" data-shell="' + data[key]['shell'] + '" type="button" title="Editer" class="btn btn-default btn-xs editUser"><span class="glyphicon glyphicon-edit"></span></button><button data-usr="' + data[key]['id'] + '" type="button" title="Supprimer" class="btn btn-danger btn-xs delUsr"><span class="glyphicon glyphicon-trash"></span></button></td></tr>');
            } else {
              $('#listUser').append('<tr><td>' + num + '</td><td>' + data[key]['userid'] + '</td><td>Oui</td><td>' + data[key]['uid'] + '</td><td>' + data[key]['gid'] + '</td><td>' + data[key]['homedir'] + '</td><td>' + data[key]['shell'] + '</td><td><input class="accessBox" data-access="' + data[key]['id'] + '" type="checkbox"></td><td><button data-iduser="' + data[key]['id'] + '" data-username="' + data[key]['userid'] + '" data-uid="' + data[key]['uid'] + '" data-gid="' + data[key]['gid'] + '" data-homedir="' + data[key]['homedir'] + '" data-shell="' + data[key]['shell'] + '" type="button" title="Editer" class="btn btn-default btn-xs editUser"><span class="glyphicon glyphicon-edit"></span></button><button data-usr="' + data[key]['id'] + '" type="button" title="Supprimer" class="btn btn-danger btn-xs delUsr"><span class="glyphicon glyphicon-trash"></span></button></td></tr>');
            }
          } else {
            $('#listUser').append('<tr><td>' + num + '</td><td>' + data[key]['userid'] + '</td><td>Non</td><td>' + data[key]['uid'] + '</td><td>' + data[key]['gid'] + '</td><td>' + data[key]['homedir'] + '</td><td>' + data[key]['shell'] + '</td><td><input class="accessBox" data-access="' + data[key]['id'] + '" type="checkbox" checked=' + data[key]['LoginAllowed'] + '></td><td><button data-iduser="' + data[key]['id'] + '" data-username="' + data[key]['userid'] + '" data-uid="' + data[key]['uid'] + '" data-gid="' + data[key]['gid'] + '" data-homedir="' + data[key]['homedir'] + '" data-shell="' + data[key]['shell'] + '" type="button" title="Editer" class="btn btn-default btn-xs editUser"><span class="glyphicon glyphicon-edit"></span></button><button data-usr="' + data[key]['id'] + '" type="button" title="Supprimer" class="btn btn-danger btn-xs delUsr"><span class="glyphicon glyphicon-trash"></span></button></td></tr>');
          }
          num++;
          i++;
        }
        initUserBinding();
      },
      error: function () {
        console.log('La requête pour récupérer les utilisateurs a expiré!');
      }
    });

    return xhr.promise();
  }

  function getGroupList() {
    $('#listGroup').html('');
    $('#UserGrp').html('');

    var xhr = $.ajax({
      url: '/groups',
      timeout: 5000,
      dataType: 'json',
      success: function (data) {
        var cpt = 1;
        var group_list = '';
        for (var key in data) {
          group_list += '<tr><td>' + data[key]['groupname'] + '</td><td>' + data[key]['gid'] + '</td><td>' + data[key]['members'] + '</td><td><button type="button" data-grpname="' + data[key]['groupname'] + '" data-gid="' + data[key]['gid'] + '" data-members="' + data[key]['members'] + '" title="Editer" class="btn btn-default btn-xs editGroup"><span class="glyphicon glyphicon-edit"></span></button><button data-id="' + data[key]['gid'] + '" type="button" title="Supprimer" class="btn btn-danger btn-xs delGrp"><span class="glyphicon glyphicon-trash"></span></button></td></tr>';
          $('#UserGrp').append($('<option data-numb=' + cpt + '>').text(data[key]['gid'] + ' - ' + data[key]['groupname']).attr('value', data[key]['gid']));
          cpt++;
        }
        $('#listGroup').append(group_list);
        initGroupBinding();
      },
      error: function () {
        console.log('La requête pour récuprer les groupes a expiré!');
      }
    });

    return xhr.promise();
  }

  /**********   Modification   ************/

  function editGroup(group_id) {
    var cptError = 0;
    var grpName = $('#GroupName').val();
    var grpId = $('#GroupId').val();
    var grpMember = $('#GroupMember').val();

    if (grpName === '') {
      $('#GroupName').addClass('errorBorder');
      $('#ErrorGroup').show('fast');
      $('.errorContent').append('Entrez le nom du groupe!');
      cptError++;
    }

    if (cptError === 0) {
      var datastr = {};
      datastr.nameGrp = grpName;
      datastr.idGroup = grpId;
      datastr.membGrp = grpMember;

      $.ajax({
        type: 'PUT',
        url: '/groups/' + group_id,
        data: datastr,
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
          var ErrorContent = '';
          if (data.errors) {
            for (var i in data.errors) {
              ErrorContent += '<strong>' + data.errors[i].message + '</strong><br/>'
            }
            $('.errorContent').html(ErrorContent);
            $('#ErrorGroup').show('fast');
          } else {
            getGroupList();
            $('#ModalGroup').modal('hide');
            resetGroupModal();
          }
        },
        error: function () {
          $('.errorContent').html('La requête a expiré !');
          $('#ErrorGroup').show('fast');
        }
      });
    }
  }

  function editUser(user_id) {
    var cptError = 0;
    var usrName = $('#UserName').val();
    var usrPwd = $('#PwdUser').val();
    var usrId = $('#UserId').val();
    var usrGrp = $('#UserGrp').val();
    var usrHomeDir = $('#HomeDir').val();
    var usrShell = $('#Shell').val();

    if (usrName === '') {
      $('#UserName').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Entrez un nom d\'utilisateur!<br/>');
      cptError++;
    }
    if (usrId === '') {
      $('#UserId').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Indiquez un user id!<br/>');
      cptError++;
    }
    if (usrHomeDir === '') {
      $('#HomeDir').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Indiquez un répertoire personnel!<br/>');
      cptError++;
    }
    if (usrShell === '') {
      $('#Shell').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Déterminez le shell utilisateur!<br/>');
      cptError++;
    }

    if (cptError === 0) {
      var datastr = {};
      datastr.name = usrName;
      datastr.pwd = usrPwd;
      datastr.uid = usrId;
      datastr.grp = usrGrp;
      datastr.homedir = usrHomeDir;
      datastr.shell = usrShell;

      $.ajax({
        type: 'PUT',
        url: '/users/' + user_id,
        data: datastr,
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
          //console.log('result: ', data.errors);
          var ErrorContent = '';
          if (data.errors) {
            for (var i in data.errors) {
              ErrorContent += '<strong>' + data.errors[i].message + '</strong><br/>'
            }
            $('.errorContent').html(ErrorContent);
            $('#ErrorUser').show('fast');
          } else {
            $('#ModalUser').modal('hide');
            getUserList();
            resetUserModal();
          }
        },
        error: function () {
          //console.log('La requête pour modifier l\'utilisateur a expiré!');
          $('.errorContent').html('La requête a expiré !');
          $('#ErrorUser').show('fast');
        }
      });
    }
  }

  /**********   Ajout   ************/

  function isNumber(input) {
    return !isNaN(input);
  }

  function addGroup() {
    var cptError = 0;
    var grpName = $('#GroupName').val();
    var grpId = $('#GroupId').val();
    var grpMember = $('#GroupMember').val();
    var checkInt = isNumber(grpId);

    if (grpName === '') {
      $('#GroupName').addClass('errorBorder');
      $('#ErrorGroup').show('fast');
      $('.errorContent').append('Entrez le nom du groupe !<br/>');
      cptError++;
    }
    if (grpId === '') {
      $('#GroupId').addClass('errorBorder');
      $('#ErrorGroup').show('fast');
      $('.errorContent').append('Entrez un Gid !<br/>');
      cptError++;
    }
    if (checkInt != true){
      $('#GroupId').addClass('errorBorder');
      $('#ErrorGroup').show('fast');
      $('.errorContent').append('Le Gid doit être un nombre !<br/>');
      cptError++;
    }

    if (cptError === 0) {
      var datastr = {};
      datastr.nameGrp = grpName;
      datastr.idGroup = grpId;
      datastr.membGrp = grpMember;

      $.ajax({
        type: 'POST',
        url: '/groups',
        data: datastr,
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
          var ErrorContent = '';
          if (data.errors) {
            for (var i in data.errors) {
              ErrorContent += '<strong>' + data.errors[i].message + '</strong><br/>';
            }
            $('.errorContent').html(ErrorContent);
            $('#ErrorGroup').show('fast');
          } else if (data.dup) {
            $('.errorContent').html('<strong>' + data.dup + '</strong><br/>');
            $('#ErrorGroup').show('fast');
          } else {
            getGroupList();
            $('.succesContent').html('<strong>Le groupe a été ajouté!</strong>');
            $('#SuccessGroup').show();
            //Reset des champs
            $('#GroupName').val('');
            $('#GroupId').val('');
            $('#GroupMember').val('');
            $('#ModalGroup').modal('hide');
            $('#SuccessGroup').hide();
          }
        },
        error: function () {
          //console.log('La requête pour ajouter le groupe a expiré!');
          $('.errorContent').html('La requête a expiré !');
          $('#ErrorGroup').show('fast');
        }
      });
    }
  }

  function  addUser() {
    var cptError = 0;
    var usrName = $('#UserName').val();
    var usrPwd = $('#PwdUser').val();
    var usrId = $('#UserId').val();
    var usrGrp = $('#UserGrp').val();
    var usrHomeDir = $('#HomeDir').val();
    var usrShell = $('#Shell').val();

    if (usrName === '') {
      $('#UserName').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Entrez un nom d\'utilisateur !<br/>');
      cptError++;
    }
    if (usrPwd === '') {
      $('#PwdUser').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Choisissez un mot de passe !<br/>');
      cptError++;
    }
    if (usrId === '') {
      $('#UserId').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Indiquez un user id !<br/>');
      cptError++;
    }
    if (usrHomeDir === '') {
      $('#HomeDir').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Indiquez un répertoire personnel !<br/>');
      cptError++;
    }
    if (usrShell === '') {
      $('#Shell').addClass('errorBorder');
      $('#ErrorUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Déterminez le shell utilisateur !<br/>');
      cptError++;
    }

    if (cptError === 0) {
      var datastr = {};
      datastr.name = usrName;
      datastr.pwd = usrPwd;
      datastr.uid = usrId;
      datastr.grp = usrGrp;
      datastr.homedir = usrHomeDir;
      datastr.shell = usrShell;

      $.ajax({
        type: 'POST',
        url: '/users',
        data: datastr,
        timeout: 5000,
        dataType: 'json',
        success: function (data) {
          var ErrorContent = '';
          if (data.errors) {
            for (var i in data.errors) {
              ErrorContent += '<strong>' + data.errors[i].message + '</strong><br/>'
            }
            $('.errorContent').html(ErrorContent);
            $('#ErrorUser').show('fast');
          } else {
            getUserList();
            $('.succesContent').html('<strong>L\'utilisateur a été ajouté</strong>');
            $('#SuccessAddUser').show('fast');
            resetUserModal();
            $('#ModalUser').modal('hide');
            $('#SuccessUser').hide('fast');
          }
        },
        error: function () {
          //console.log('La requête pour ajouter l\'utilisateur a expiré!');
          $('.errorContent').html('La requête a expiré !');
          $('#ErrorUser').show('fast');
        }
      });
    }
  }

  /**********   Suppression   ************/

  function delGroup(CurrentGroup) {
    $.ajax({
      type: 'DELETE',
      url: '/groups/' + CurrentGroup,
      timeout: 5000,
      dataType: 'json',
      success: function (data) {
        console.log(data);
        getGroupList();
      },
      error: function () {
        console.log('La requête pour supprimer le groupe a expiré!');
      }
    });
  }

  function delUser(CurrentUser) {
    $.ajax({
      type: 'DELETE',
      url: '/users/' + CurrentUser,
      timeout: 5000,
      dataType: 'json',
      success: function (data) {
        console.log(data);
        getUserList();
      },
      error: function () {
        console.log('La requête pour supprimer l\'utilisateur a expiré!');
      }
    });
  }

  /**********   Accès   ************/

  function getAccess(usr, bool){
    var datastr = {};
    datastr.check = bool;

    $.ajax({
      type: 'PUT',
      url: '/users/' + usr,
      timeout: 5000,
      data: datastr,
      dataType: 'json',
      success: function (data) {
        console.log(data);
        getUserList();
      },
      error: function () {
        console.log('La requête pour supprimer l\'utilisateur a expiré!');
      }
    });
  }

})(window);