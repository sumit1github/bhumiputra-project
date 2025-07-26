import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { TbArrowBigDownLinesFilled } from "react-icons/tb";
import { useSearchParams } from "react-router";


import AdminLayout from '../IT-Dashboard/AdminLayout'
import { GetDirectUsersApiCall } from './auth_calls'
import './ViewTeam.css'

export const ViewTeam = () => {
    const [searchParams] = useSearchParams();
    const parent = searchParams.get("parent");
    const parent_name = searchParams.get("parent_name");

    const userData = useSelector((state) => state.user);

    const [users, setUsers] = useState([]);

    const { mutate: loadUserList, isLoading, isError, error, data } = GetDirectUsersApiCall();

    // Load user list when component mounts or when page changes
    useEffect(() => {

        if (userData?.user?.is_admin) {
            loadUserList(parent);
        }
        else {
            loadUserList(userData?.user?.id_prefix + userData?.user?.id);
        }

    }, []);

    useEffect(() => {
        if (data) {
            setUsers(data.users || []);
        }
    }, [data]);


    // load user list
    const { mutate: loadDownline, data: DownlineData } = GetDirectUsersApiCall();
    const getDownline = (parent_id) => {
        loadDownline(parent_id);
    };

    useEffect(() => {
        if (DownlineData) {
            setUsers(prevUsers => {
                const allUsers = [...prevUsers, ...(DownlineData.users || [])];
                const uniqueUsers = Array.from(
                    new Map(allUsers.map(user => [user.id, user])).values()
                );
                return uniqueUsers;
            });
        }
    }, [DownlineData]);

    // Helper to build nested user tree
    const buildUserTree = (users) => {
        const userMap = {};
        users.forEach(user => {
            user.children = [];
            userMap[user.id] = user;
        });
        const tree = [];
        users.forEach(user => {
            // FIX: parent is an ID, not an object
            if (user.parent && userMap[user.parent]) {
                userMap[user.parent].children.push(user);
            } else {
                tree.push(user);
            }
        });
        return tree;
    };

    // Recursive render function
    const renderUser = (user, level = 0) => (
        <div key={user.id} className={`user-tree-node${level > 0 ? ' user-tree-child' : ''}`}>
            <div className="card user-card">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center flex-grow-1">
                            <div className="user-avatar me-3">
                                {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </div>
                            <div className="user-info flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="mb-1 fw-bold user-name">{user.full_name}</h6>
                                        <div className="user-details">
                                            <small className="text-muted d-block">ID: {user.id_prefix}{user.id}</small>
                                            <small className="text-muted d-block">Joined: {new Date(user.date_joined).toLocaleDateString()}</small>
                                            <small className="text-muted d-block">Tokens: {user.invite_tokens}</small>
                                        </div>
                                    </div>
                                    <div className="user-stats text-end">
                                        <div className="level-badge mb-1">Level: {user.achiver_level}</div>
                                        <div className="balance-amount">₹{user.wallet_balance}</div>
                                        {user.achiver_level > 0 &&
                                            <div>
                                                <TbArrowBigDownLinesFilled onClick={() => getDownline(user.id_prefix + user.id)} style={{ color: 'green', fontSize: "35px" }} />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Render children recursively */}
            {user.children && user.children.length > 0 && (
                <div className="nested-users">
                    {user.children.map(child => renderUser(child, level + 1))}
                </div>
            )}
        </div>
    );

    const userTree = buildUserTree(users);

    return (
        <AdminLayout>
            <div className="team-view-container p-4">
                {/* Header */}
                <div className="team-header mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-2">Direct Team of ({parent_name || userData.user.full_name})</h2>
                            <p className="text-muted mb-0">ID : {parent || userData.user.id_prefix + userData.user.id}</p>
                        </div>
                    </div>
                </div>

                {/* Team Members List */}
                {userTree.map(user => renderUser(user))}

            </div>
        </AdminLayout>
    )
}
