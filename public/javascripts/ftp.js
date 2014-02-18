
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
      $('#ErrorAddGroup').hide('fast');
      $('.errorContent').html('');
    });
    $('#EditGroupName').focus(function () {
      $('#EditGroupName').removeClass('errorBorder');
      $('#ErrorEditGroup').hide('fast');
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
        $('#ErrorAddUser').hide('fast');
        $('.errorContent').html('');
      });
    });

    $('#ModalAddgroup').focusout(function () {
      $('#ErrorAddGroup').hide('fast');
      $('.errorContent').html('');
      $('#GroupName').removeClass('errorBorder');
      $('#GroupId').removeClass('errorBorder');
    });
    $('#ModalEditGroup').focusout(function () {
      $('#ErrorEditGroup').hide('fast');
      $('.errorContent').html('');
    });
    $('#ModalAddUser').focusout(function () {
      $('#ErrorAddUser').hide('fast');
      $('.errorContent').html('');
      $('#UserName').removeClass('errorBorder');
      $('#PwdUser').removeClass('errorBorder');
      $('#UserId').removeClass('errorBorder');
      $('#HomeDir').removeClass('errorBorder');
      $('#Shell').removeClass('errorBorder');
    });
    $('#ModalEditUser').focusout(function () {
      $('#ErrorEditUser').hide('fast');
      $('.errorContent').html('');
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
      $('#ErrorAddGroup').hide('fast');
      $('.errorContent').html('');
      addGroup();
    });
    $('#user').click(function () {
      $('#ErrorAddUser').hide('fast');
      $('.errorContent').html('');
      addUser();
    });

    //Modification
    $('#SubmitEditGroup').click(function () {
      editGroup(id_group);
    });
    $('#SubmitEditUser').click(function () {
      editUser(id_user);
    });
  });

  //Fonctions

  //Permet de binder les éléments au DOM après mes requêtes ajax
  function initUserBinding() {

    $('.delUsr').on('click', function () {
      var id = $(this).attr('data-usr');
      var answer = confirm("Etes-vous sûr de supprimer cet utilisateur?");
      if (answer){
        delUser(id);
      }
    });

    $('.editUser').on('click', function () {
      id_user = $(this).attr('data-iduser');
      //console.log('iduser: ' + id_user);
      $('#EditName').val($(this).attr('data-username'));
      $('#EditId').val($(this).attr('data-uid'));
      $('#EditGrp').val($(this).attr('data-gid'));
      $('#EditHomeDir').val($(this).attr('data-homedir'));
      $('#EditShell').val($(this).attr('data-shell'));
      $('#ModalEditUser').modal('show');
    });

  }
  function initGroupBinding() {

    $('.delGrp').on('click', function () {
      var id = $(this).attr('data-id');
      var answer = confirm("Etes-vous sûr de supprimer ce groupe?");
      if (answer){
        delGroup(id);
      }
    });

    $('.editGroup').on('click', function () {
      id_group = $(this).attr('data-gid');
      $('#EditGroupName').val($(this).attr('data-grpname'));
      $('#EditGroupId').val($(this).attr('data-gid'));
      $('#EditGroupMember').val($(this).attr('data-members'));
      $('#ModalEditGroup').modal('show');
    });

  }

  /**********   Listage   ************/

  function getUserList() {
    $('#listUser').html('');
    var num = 1;

    var xhr = $.ajax({
      url: '/users',
      timeout: 5000,
      dataType: 'json',
      success: function (data) {
        //console.log('Users Pwd: ', data[4]['passwd']);
        for (var key in data) {
          if (data[key]['passwd'] === undefined)
            $('#listUser').append('<tr><td>' + num + '</td><td>' + data[key]['userid'] + '</td><td>Oui</td><td>' + data[key]['uid'] + '</td><td>' + data[key]['gid'] + '</td><td>' + data[key]['homedir'] + '</td><td>' + data[key]['shell'] + '</td><td><button data-iduser="' + data[key]['id'] + '" data-username="' + data[key]['userid'] + '" data-uid="' + data[key]['uid'] + '" data-gid="' + data[key]['gid'] + '" data-homedir="' + data[key]['homedir'] + '" data-shell="' + data[key]['shell'] + '" type="button" title="Editer" class="btn btn-default btn-xs editUser"><span class="glyphicon glyphicon-edit"></span></button><button data-usr="' + data[key]['id'] + '" type="button" title="Supprimer" class="btn btn-danger btn-xs delUsr"><span class="glyphicon glyphicon-trash"></span></button></td></tr>');
          else
            $('#listUser').append('<tr><td>' + num + '</td><td>' + data[key]['userid'] + '</td><td>Non</td><td>' + data[key]['uid'] + '</td><td>' + data[key]['gid'] + '</td><td>' + data[key]['homedir'] + '</td><td>' + data[key]['shell'] + '</td><td><button data-iduser="' + data[key]['id'] + '" data-username="' + data[key]['userid'] + '" data-uid="' + data[key]['uid'] + '" data-gid="' + data[key]['gid'] + '" data-homedir="' + data[key]['homedir'] + '" data-shell="' + data[key]['shell'] + '" type="button" title="Editer" class="btn btn-default btn-xs editUser"><span class="glyphicon glyphicon-edit"></span></button><button data-usr="' + data[key]['id'] + '" type="button" title="Supprimer" class="btn btn-danger btn-xs delUsr"><span class="glyphicon glyphicon-trash"></span></button></td></tr>');
          num++;
        }
        initUserBinding();
      },
      error: function () {
        console.log('La requête pour récuprer les utilisateurs a expiré!');
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
        //console.log(data);
        var cpt = 1;
        var group_list = '';
        for (var key in data) {
          group_list += '<tr><td>' + data[key]['groupname'] + '</td><td>' + data[key]['gid'] + '</td><td>' + data[key]['members'] + '</td><td><button type="button" data-grpname="' + data[key]['groupname'] + '" data-gid="' + data[key]['gid'] + '" data-members="' + data[key]['members'] + '" title="Editer" class="btn btn-default btn-xs editGroup"><span class="glyphicon glyphicon-edit"></span></button><button data-id="' + data[key]['gid'] + '" type="button" title="Supprimer" class="btn btn-danger btn-xs delGrp"><span class="glyphicon glyphicon-trash"></span></button></td></tr>';
          $('#UserGrp').append($('<option data-numb=' + cpt + '>').text(data[key]['groupname']).attr('value', data[key]['gid']));
          $('#EditGrp').append($('<option data-numb=' + cpt + '>').text(data[key]['groupname']).attr('value', data[key]['gid']));
          cpt++;
        }
        initGroupBinding();
        $('#listGroup').append(group_list);
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
    var grpName = $('#EditGroupName').val();
    var grpId = $('#EditGroupId').val();
    var grpMember = $('#EditGroupMember').val();

    if (grpName === '') {
      $('#EditGroupName').addClass('errorBorder');
      $('#ErrorEditGroup').show('fast');
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
          //console.log('EDIT GRP: ', data);
          var ErrorContent = '';
          if (data.errors) {
            for (var i in data.errors) {
              ErrorContent += '<strong>' + data.errors[i].message + '</strong><br/>'
            }
            $('.errorContent').html(ErrorContent);
            $('#ErrorEditGroup').show('fast');
          } else {
            getGroupList();
            $('#ModalEditGroup').modal('hide');
          }
        },
        error: function () {
          //console.log('La requête pour editer le groupe a expiré!');
          $('.errorContent').html('La requête a expiré !');
          $('#ErrorEditGroup').show('fast');
        }
      });
    }
  }

  function editUser(user_id) {
    var cptError = 0;
    var usrName = $('#EditName').val();
    var usrPwd = $('#EditPwd').val();
    var usrId = $('#EditId').val();
    var usrGrp = $('#EditGrp').val();
    var usrHomeDir = $('#EditHomeDir').val();
    var usrShell = $('#EditShell').val();

    if (usrName === '') {
      $('#EditName').addClass('errorBorder');
      $('#ErrorEditUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Entrez un nom d\'utilisateur!<br/>');
      cptError++;
    }
    if (usrId === '') {
      $('#EditId').addClass('errorBorder');
      $('#ErrorEditUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Indiquez un user id!<br/>');
      cptError++;
    }
    if (usrHomeDir === '') {
      $('#EditHomeDir').addClass('errorBorder');
      $('#ErrorEditUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Indiquez un répertoire personnel!<br/>');
      cptError++;
    }
    if (usrShell === '') {
      $('#EditShell').addClass('errorBorder');
      $('#ErrorEditUser').show('fast');
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
            $('#ErrorEditUser').show('fast');
          } else {
            $('#ModalEditUser').modal('hide');
            getUserList();
          }
        },
        error: function () {
          //console.log('La requête pour modifier l\'utilisateur a expiré!');
          $('.errorContent').html('La requête a expiré !');
          $('#ErrorEditUser').show('fast');
        }
      });
    }
  }

  /**********   Ajout   ************/

  function addGroup() {
    var cptError = 0;
    var grpName = $('#GroupName').val();
    var grpId = $('#GroupId').val();
    var grpMember = $('#GroupMember').val();

    if (grpName === '') {
      $('#GroupName').addClass('errorBorder');
      $('#ErrorAddGroup').show('fast');
      $('.errorContent').append('Entrez le nom du groupe !<br/>');
      cptError++;
    }
    if (grpId === '') {
      $('#GroupId').addClass('errorBorder');
      $('#ErrorAddGroup').show('fast');
      $('.errorContent').append('Entrez un Gid !<br/>');
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
            $('#ErrorAddGroup').show('fast');
          } else if (data.dup) {
            $('.errorContent').html('<strong>' + data.dup + '</strong><br/>');
            $('#ErrorAddGroup').show('fast');
          } else {
            getGroupList();
            $('.succesContent').html('<strong>Le groupe a été ajouté!</strong>');
            $('#SuccessAddGroup').show();
            //Reset des champs
            $('#GroupName').val('');
            $('#GroupId').val('');
            $('#GroupMember').val('');
            $('#ModalAddgroup').modal('hide');
            $('#SuccessAddGroup').hide();
          }
        },
        error: function () {
          //console.log('La requête pour ajouter le groupe a expiré!');
          $('.errorContent').html('La requête a expiré !');
          $('#ErrorAddGroup').show('fast');
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
      $('#ErrorAddUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Entrez un nom d\'utilisateur !<br/>');
      cptError++;
    }
    if (usrPwd === '') {
      $('#PwdUser').addClass('errorBorder');
      $('#ErrorAddUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Choisissez un mot de passe !<br/>');
      cptError++;
    }
    if (usrId === '') {
      $('#UserId').addClass('errorBorder');
      $('#ErrorAddUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Indiquez un user id !<br/>');
      cptError++;
    }
    if (usrHomeDir === '') {
      $('#HomeDir').addClass('errorBorder');
      $('#ErrorAddUser').show('fast');
      $('.errorContent').append('<strong>Attention</strong> Indiquez un répertoire personnel !<br/>');
      cptError++;
    }
    if (usrShell === '') {
      $('#Shell').addClass('errorBorder');
      $('#ErrorAddUser').show('fast');
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
            $('#ErrorAddUser').show('fast');
          } else {
            getUserList();
            $('.succesContent').html('<strong>L\'utilisateur a été ajouté</strong>');
            $('#SuccessAddUser').show('fast');
            //Reset des champs
            $('#UserName').val('');
            $('#PwdUser').val('');
            $('#UserId').val('0');
            $('#UserGrp').val('5500');
            $('#HomeDir').val('');
            $('#Shell').val('');
            $('#ModalAddUser').modal('hide');
            $('#SuccessAddUser').hide('fast');
          }
        },
        error: function () {
          //console.log('La requête pour ajouter l\'utilisateur a expiré!');
          $('.errorContent').html('La requête a expiré !');
          $('#ErrorAddUser').show('fast');
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
})(window);
