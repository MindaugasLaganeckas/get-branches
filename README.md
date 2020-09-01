# get-default-branch
Get the default branch or an empty string, if there are no branches in the repository.
You can call the action in your workflow like this:
```
    - name: Get default branch name
      id: defaultBranchName
      uses: MindaugasLaganeckas/get-default-branch@master
      with:
        token: ${{ secrets.SUPER_SECRET }}
        path: ${{ env.OWNER }}/${{ env.REPO }}
```
You can access the output like this:
```
    - name: Change to master branch if repository is empty
      if: ${{ steps.defaultBranchName.outputs.default-branch == '' }}
```        
